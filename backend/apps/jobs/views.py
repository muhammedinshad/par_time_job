from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Job
from .serializer import JobSerializer


class JobCreateView(APIView):
    """Employer creates a new job posting."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Role check = employer 
            print(f"request is : {request}")
            if request.user.role != 'employer':
                return Response(
                    {'error': 'Only employers can post jobs.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # check Employer profile 
            try:
                employer_profile = request.user.employer_profile
            except Exception:
                return Response(
                    {'error': 'Employer profile not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = JobSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(employer=employer_profile)
                return Response({
                    'message': 'Job posted successfully!',
                    'job':     serializer.data
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobListView(APIView):
    """Employers jobs list."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if request.user.role != 'employer':
                return Response(
                    {'error': 'Only employers can access this.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            jobs = Job.objects.filter(
                employer=request.user.employer_profile
            ).order_by('-created_at')

            serializer = JobSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobDetailView(APIView):
    """Employer — see job, edit, delete."""
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, employer_profile):
        try:
            return Job.objects.get(pk=pk, employer=employer_profile)
        except Job.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            if request.user.role != 'employer':
                return Response(
                    {'error': 'Only employers can access this.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            job = self.get_object(pk, request.user.employer_profile)
            if not job:
                return Response(
                    {'error': 'Job not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(JobSerializer(job).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, pk):
        try:
            if request.user.role != 'employer':
                return Response(
                    {'error': 'Only employers can access this.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            job = self.get_object(pk, request.user.employer_profile)
            if not job:
                return Response(
                    {'error': 'Job not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = JobSerializer(job, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Job updated successfully!',
                    'job':     serializer.data
                }, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        try:
            if request.user.role != 'employer':
                return Response(
                    {'error': 'Only employers can access this.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            job = self.get_object(pk, request.user.employer_profile)
            if not job:
                return Response(
                    {'error': 'Job not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            job.delete()
            return Response(
                {'message': 'Job deleted successfully.'},
                status=status.HTTP_204_NO_CONTENT
            )

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )