from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    def has_object_permission(self, request: Request, view: APIView, obj: object) -> bool:
        """
        Check if the user is the owner of the object.

        Args:
            request: The request object.
            view: The view object.
            obj: The object to be checked for ownership.
        """
        return obj.owner == request.user


class ProfileIsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a profile to access it.
    """
    def has_object_permission(sself, request: Request, view: APIView, obj: object) -> bool:
        """
        Check if the user is the owner of the profile.

        Args:
            request: The request object.
            view: The view object.
            obj: The profile object to be checked for ownership.
        """
        return obj.username == request.user.username


class AuctionImageIsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an auction image to access it.
    """
    def has_object_permission(self, request: Request, view: APIView, obj: object) -> bool:
        """
        Check if the user is the owner of the auction image.

        Args:
            request: The request object.
            view: The view object.
            obj: The auction image object to be checked for ownership.
        """
        return obj.auction.owner == request.user
