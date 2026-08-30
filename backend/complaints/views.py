from django.contrib.auth.models import User
from rest_framework import permissions, viewsets, generics
from rest_framework.permissions import SAFE_METHODS
from .models import Complaint
from .serializers import ComplaintSerializer, RegisterSerializer, UserSerializer


class IsOwnerOrSuperuser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return obj.user == request.user


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().order_by('-id')
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrSuperuser]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Complaint.objects.all().order_by('-id')
        return Complaint.objects.filter(user=self.request.user).order_by('-id')

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

        serializer.save(assigned_to=assigned_to, user=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
