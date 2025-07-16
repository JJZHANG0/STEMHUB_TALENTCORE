from rest_framework import viewsets
from .models import Candidate
from .serializers import CandidateSerializer
from .pagination import CustomPagination
from django_filters.rest_framework import DjangoFilterBackend



class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all().order_by('-created_at')
    serializer_class = CandidateSerializer
    pagination_class = CustomPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('major', 'gender')
