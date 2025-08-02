from rest_framework import viewsets
from .models import Complaint
from .serializers import ComplaintSerializer

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().order_by('-id')
    serializer_class = ComplaintSerializer

    # Auto-assign staff based on category
    def perform_create(self, serializer):
        category = self.request.data.get('category')

        if category == 'hostel':
            assigned_to = 'Hostel Warden'
        elif category == 'lab':
            assigned_to = 'Lab Incharge'
        elif category == 'admin':
            assigned_to = 'Admin Officer'
        else:
            assigned_to = 'Unassigned'

        serializer.save(assigned_to=assigned_to)
