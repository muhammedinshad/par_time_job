from django.urls import path
from .views.seeker_views import ApplyToJobView, MyApplicationsView
from .views.employer_view import EmployerApplicationDetailView,EmployerApplicationListView,ApplicationStatusUpdateView


urlpatterns = [
    path('apply-job/',      ApplyToJobView.as_view(),    name='apply-to-job'),
    path('mine/', MyApplicationsView.as_view(), name='my-applications'),
    
    path('employer/applications/', EmployerApplicationListView.as_view(), name='employer-application-list'),
    path('employer/applications/<int:pk>/', EmployerApplicationDetailView.as_view(), name='employer-application-detail'),
    path('employer/applications/status/<int:pk>/', ApplicationStatusUpdateView.as_view(), name='employer-application-status'),
]