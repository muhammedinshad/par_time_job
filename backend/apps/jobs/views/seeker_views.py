from rest_framework.views import APIView
from rest_framework.response import Response
from ..serializer import JobSerializer
from ..models import Job
from rest_framework import status
# ─── Job Seeker - എല്ലാ Active Jobs കാണാൻ ───────────────────
class JobListForSeekerView(APIView):

    def get(self, request):
        try:
            jobs = (
                Job.objects
                .filter(is_active=True)
                .select_related('employer')
                .order_by('-created_at')
            )
            serializer = JobSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ─── Job Seeker - ഒരു Job-ന്റെ Detail കാണാൻ ────────────────
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