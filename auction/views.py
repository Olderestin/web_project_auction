from typing import Iterable

from django.shortcuts import get_object_or_404
from rest_framework import mixins
from rest_framework import parsers
from rest_framework import permissions
from rest_framework import viewsets

from .permissions import AuctionImageIsOwner
from .permissions import IsOwner
from .permissions import ProfileIsOwner
from .serializers import AuctionImageSerializer
from .serializers import AuctionSerializer
from .serializers import BidSerializer
from .serializers import UserProfileSerializer
from auction.models import Auction
from auction.models import AuctionImage
from auction.models import Bid
from user.models import User


class AuctionViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing auctions.
    """
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_permissions(self) -> Iterable[permissions.BasePermission]:
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwner]
        return (permission() for permission in permission_classes)


class AuctionImageViewSet(
    mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet
):
    """
    A ViewSet for creating and deleting auction images.
    """
    queryset = AuctionImage.objects.all()
    serializer_class = AuctionImageSerializer
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.FileUploadParser,
    )

    permission_classes = (
        permissions.IsAuthenticated,
        AuctionImageIsOwner,
    )


class BidViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    A ViewSet for creating bids.
    """
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    A ViewSet for viewing, updating, and listing user profiles.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    lookup_field = "username"

    http_method_names = ["get", "patch"]

    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.FileUploadParser,
    )

    def get_permissions(self) -> Iterable[permissions.BasePermission]:
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "retrieve" or self.action == "list":
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, ProfileIsOwner]
        return (permission() for permission in permission_classes)

    def get_object(self) -> User:
        """
        Retrieve and return the requested user profile.
        """
        queryset = self.get_queryset()

        lookup_value = self.kwargs[self.lookup_field]

        obj = get_object_or_404(queryset, **{self.lookup_field: lookup_value})
        self.check_object_permissions(self.request, obj)
        return obj
