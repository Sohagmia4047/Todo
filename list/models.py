from datetime import timedelta
from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=100, null=True)
    image = models.ImageField(blank=True, null=True, upload_to='images/')
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    #duration_days = models.PositiveIntegerField(default=1)
    end_time = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.end_time:
            raise ValueError("End time is required")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
