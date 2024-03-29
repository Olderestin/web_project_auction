import pathlib
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class Auction(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    bid = models.IntegerField(default=None, null=True)
    start_bid = models.IntegerField()
    bid_step = models.IntegerField()

    def __str__(self) -> str:
        """
        Returns a string representation of the auction object.
        """
        return self.title

    def delete_related_images(self):
        """
        Deletes the related images of the auction.
        """
        for auction_image in self.images.all():
            auction_image.delete()

    def delete(self, *args, **kwargs):
        """
        Overridden delete method.
        Deletes the auction object and all its related images.
        """
        self.delete_related_images()
        super().delete(*args, **kwargs)


def generate_image_filename(instance: "AuctionImage", filename: str) -> str:
    username = instance.auction.owner.username
    date_string = timezone.now().strftime("%Y.%m.%d.%H.%M.%S")
    unique_id = str(uuid.uuid4())
    extension = pathlib.Path(filename).suffix
    new_filename = f"post_images/{date_string}_{username}_{unique_id}{extension}"
    return new_filename


class AuctionImage(models.Model):
    auction = models.ForeignKey(
        Auction, related_name="images", default=None, on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to=generate_image_filename)

    def delete(self, *args, **kwargs):
        """
        Overridden delete method.
        Deletes the auction image and its file.
        """
        self.image.delete()
        super().delete(*args, **kwargs)


class Bid(models.Model):
    auction = models.ForeignKey(Auction, related_name="bids", on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="bids", on_delete=models.CASCADE
    )
    bid = models.IntegerField()

    def __str__(self) -> str:
        """
        Returns a string representation of the bid object.
        """
        return "{} - {}".format(self.auction.title, self.user)
