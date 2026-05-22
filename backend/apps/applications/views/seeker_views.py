from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from apps.common.permissions import IsJobSeeker
from ..models import Application
from ..serializers.seeker_serializers import (
    ApplicationCreateSerializer,
    MyApplicationSerializer,
)


class ApplyToJobView(APIView):
    permission_classes = [IsJobSeeker]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        try:
            serializer = ApplicationCreateSerializer(
                data    = request.data,
                context = {'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'message': 'Application submitted successfully!'},
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyApplicationsView(APIView):
    permission_classes = [IsJobSeeker]

    def get(self, request):
        try:
            applications = Application.objects.filter(
                seeker__user=request.user
            ).select_related('job__employer')

            serializer = MyApplicationSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Something went wrong', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )