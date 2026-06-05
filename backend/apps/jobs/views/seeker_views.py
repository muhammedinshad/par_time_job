from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from ..serializer import JobSerializer

from ..models import Job
from ...users.models import JobSeekerProfile

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from ...common.geocoding import geocode_location

class JobListView(APIView):
    """
    Search undenkil → Smart search (geo + text)
    Search illenkil → Nearby jobs (authenticated) or all jobs
    """
    permission_classes = []

    def get(self, request):
        try:
            query    = request.query_params.get('q', '').strip()
            category = request.query_params.get('category', None)

            # ─── SEARCH MODE ───────────────────────────────────────
            if query:
                jobs = Job.objects.filter(is_active=True).select_related('employer')

                text_filter = (
                    Q(title__icontains=query)       |
                    Q(description__icontains=query) |
                    Q(location__icontains=query) |
                    Q(category__icontains=query) |
                    Q(job_type__icontains=query) 
                )

                lat, lng = geocode_location(query)

                if lat and lng:
                    search_point = Point(lng, lat, srid=4326)
                    geo_jobs = jobs.filter(
                        coordinates__distance_lte=(search_point, D(km=25))
                    ).annotate(
                        distance=Distance('coordinates', search_point)
                    ).order_by('distance')

                    text_jobs = jobs.filter(text_filter)

                    from itertools import chain
                    seen_ids = set(geo_jobs.values_list('id', flat=True))
                    extra    = [j for j in text_jobs if j.id not in seen_ids]
                    all_jobs = list(chain(geo_jobs, extra))
                else:
                    all_jobs = jobs.filter(text_filter)

                # Category filter
                if category:
                    if isinstance(all_jobs, list):
                        all_jobs = [j for j in all_jobs if j.category == category]
                    else:
                        all_jobs = all_jobs.filter(category=category)

                return Response(JobSerializer(all_jobs, many=True).data, status=status.HTTP_200_OK)

            # ─── NEARBY MODE ───────────────────────────────────────
            if request.user.is_authenticated and request.user.role == 'job_seeker':
                try:
                    profile    = JobSeekerProfile.objects.get(user=request.user)
                    user_point = profile.coordinates

                    if user_point:
                        jobs = Job.objects.filter(
                            is_active=True,
                        ).annotate(
                            distance=Distance('coordinates', user_point)
                        ).order_by('distance')

                        if category:
                            jobs = jobs.filter(category=category)

                        return Response(JobSerializer(jobs, many=True).data, status=status.HTTP_200_OK)

                except JobSeekerProfile.DoesNotExist:
                    pass

            # ─── FALLBACK — All jobs ────────────────────────────────
            jobs = Job.objects.filter(is_active=True).order_by('-created_at')
            if category:
                jobs = jobs.filter(category=category)
            return Response(JobSerializer(jobs, many=True).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ─── See the each job Detail for Job Seeker ───────────────
class JobDetailForSeekerView(APIView):

    def get(self, request, pk):
        try:
            job = Job.objects.select_related('employer').get(pk=pk, is_active=True)
            serializer = JobSerializer(job)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Job.DoesNotExist:
            return Response(
                {'error': 'Job not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )