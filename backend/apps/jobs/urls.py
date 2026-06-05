from django.urls import path
from .views.employer_views import JobCreateView, JobListView, JobDetailView
from .views.seeker_views import JobDetailForSeekerView,JobListView

urlpatterns = [
    path('',          JobListView.as_view(),   name='job-list'),   
    path('create/',   JobCreateView.as_view(), name='job-create'),  
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'), 
     
    #----seeker-----
    path('jobs/search/',          JobListView.as_view(),   name='seeker-job-list'),
    path('jobs/<int:pk>/', JobDetailForSeekerView.as_view(), name='seeker-job-detail'),
]