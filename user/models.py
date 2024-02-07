from typing import Any
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver


class User(AbstractUser):
    user_image = models.ImageField(
        default="default/no_image.jpg", upload_to="user_images/"
    )

    def __str__(self) -> str:
        """
        Returns the string representation of the user (username).
        """
        return self.username


@receiver(pre_save, sender=User)
def delete_previous_image(sender: Any, instance: User, **kwargs: Any) -> None:
    """
    Signal receiver to delete the previous image file when updating the user image.
    """
    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
            if old_instance.user_image != instance.user_image:
                old_instance.user_image.delete(save=False)
        except sender.DoesNotExist:
            pass
