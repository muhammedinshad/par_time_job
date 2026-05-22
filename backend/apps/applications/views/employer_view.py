# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.common.permissions import IsEmployer
from ..models import Application
from ..serializers.employer_serializers import ApplicationDetailSerializer, ApplicationStatusUpdateSerializer


# ─── 1. Employer - എല്ലാ Applications കാണാൻ ─────────────────
class EmployerApplicationListView(APIView):
    permission_classes = [IsEmployer]

    def get(self, request):
        try:
            # print(f"_____________{request.user.email}")
            # employer_profile = request.user.employerprofile
            applications = (
                Application.objects
                .filter(job__employer__user=request.user)
                .select_related('seeker', 'job')
                .order_by('-applied_at')
            )
            serializer = ApplicationDetailSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # except AttributeError:
        #     return Response(
        #         {'error': 'Employer profile not found.'},
        #         status=status.HTTP_404_NOT_FOUND
        #     )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ─── 2. Employer - ഒരു Application Detail കാണാൻ ─────────────
class EmployerApplicationDetailView(APIView):
    permission_classes = [IsEmployer]

    def get(self, request, pk):
        try:
            application = Application.objects.select_related('seeker', 'job').get(pk=pk)

            # ഈ application ഈ employer-ന്റേതാണോ എന്ന് check
            if application.job.employer.user != request.user:
                return Response(
                    {'error': 'You do not have permission to view this application.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = ApplicationDetailSerializer(application)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Application.DoesNotExist:
            return Response(
                {'error': 'Application not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ─── 3. Employer - Accept / Reject ───────────────────────────
class ApplicationStatusUpdateView(APIView):
    permission_classes = [IsEmployer]

    def patch(self, request, pk):
        try:
            application = Application.objects.select_related('job').get(pk=pk)

            # Permission check
            if application.job.employer.user != request.user:
                return Response(
                    {'error': 'You do not have permission to update this application.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = ApplicationStatusUpdateSerializer(
                application,
                data=request.data,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'message': 'Application status updated successfully.', 'data': serializer.data},
                    status=status.HTTP_200_OK
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Application.DoesNotExist:
            return Response(
                {'error': 'Application not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )