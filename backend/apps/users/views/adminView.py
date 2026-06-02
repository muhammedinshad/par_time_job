from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Q
from ..models import User
from ..serializers.adminSerializers import UserListSerializer

class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        search = request.query_params.get('search', '')
        role   = request.query_params.get('role', '')

        users = User.objects.select_related(
            'employer_profile', 'job_seeker_profile'
        ).exclude(role='admin')

        if search:
            users = users.filter(
                Q(email__icontains=search) |
                Q(employer_profile__business_name__icontains=search) |
                Q(job_seeker_profile__full_name__icontains=search) |
                Q(employer_profile__location__icontains=search) |
                Q(job_seeker_profile__current_location__icontains=search)
            )

        if role in ['employer', 'job_seeker']:
            users = users.filter(role=role)

        serializer = UserListSerializer(users, many=True)
        return Response({'users': serializer.data, 'total': users.count()})


class AdminUserActionView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        """Block or Unblock a user"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        action = request.data.get('action')  # 'block' or 'unblock'
        if action == 'block':
            user.is_active = False
            user.save()
            return Response({'message': f'{user.email} blocked.'})
        elif action == 'unblock':
            user.is_active = True
            user.save()
            return Response({'message': f'{user.email} unblocked.'})
        return Response({'error': 'Invalid action'}, status=400)

    def delete(self, request, user_id):
        """Delete a user"""
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'User deleted.'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)