from django.db import models


class Candidate(models.Model):
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, blank=True)
    degree = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    major = models.CharField(max_length=100, blank=True)
    university = models.CharField(max_length=100, blank=True)
    experience_1 = models.TextField(blank=True)
    experience_2 = models.TextField(blank=True)
    experience_3 = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resume_pdf = models.FileField(upload_to="resumes/", blank=True)

    def __str__(self):
        return self.name or "Unnamed"
