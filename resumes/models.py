from django.db import models


class Candidate(models.Model):
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, blank=True)
    age = models.IntegerField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    degree = models.CharField(max_length=50, blank=True)  # 本科/硕士/博士
    graduation_date = models.DateField(blank=True, null=True)

    major = models.CharField(max_length=100, blank=True)
    bachelor_university = models.CharField(max_length=100, blank=True)
    master_university = models.CharField(max_length=100, blank=True)
    phd_university = models.CharField(max_length=100, blank=True)

    experience_1 = models.TextField(blank=True)
    experience_2 = models.TextField(blank=True)
    experience_3 = models.TextField(blank=True)
    experience_1_time = models.CharField(max_length=100, blank=True)
    experience_2_time = models.CharField(max_length=100, blank=True)
    experience_3_time = models.CharField(max_length=100, blank=True)

    base = models.CharField(max_length=100, blank=True)
    collaborated = models.BooleanField(default=False)
    quality_score = models.IntegerField(blank=True, null=True)  # 评分 1–5（或其他）

    created_at = models.DateTimeField(auto_now_add=True)
    resume_pdf = models.FileField(upload_to="resumes/", blank=True)

    def __str__(self):
        return self.name or "Unnamed"
