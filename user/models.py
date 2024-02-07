from django.contrib.auth.models import AbstractUser
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_save

class User(AbstractUser):

    user_image = models.ImageField(default='default/no_image.jpg', upload_to='user_images/')
    
    def __str__(self):
        return self.username
    
@receiver(pre_save, sender=User)
def delete_previous_image(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
            if old_instance.user_image != instance.user_image:
                old_instance.user_image.delete(save=False)
        except sender.DoesNotExist:
            pass