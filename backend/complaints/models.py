from django.db import models

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ('hostel', 'Hostel'),
        ('lab', 'Lab'),
        ('admin', 'Admin'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Pending")
    assigned_to = models.CharField(max_length=100, blank=True)  # Auto-assign field

    # ⭐ Rating optional, until student gives feedback
    rating = models.IntegerField(null=True, blank=True)  

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"
