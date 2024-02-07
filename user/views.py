from django.http import HttpRequest, HttpResponse
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from user.serializers import LoginSerializer
from user.serializers import LogoutSerializer
from user.serializers import RegisterSerializer


class RegisterView(generics.GenericAPIView):
    """
    API endpoint for user registration.
    """
    serializer_class = RegisterSerializer

    @swagger_auto_schema(tags=["Authentication"])
    def post(self, request: HttpRequest) -> HttpResponse:
        """
        Handles user registration.
        
        Args:
            request (HttpRequest): The HTTP request object.
        Returns:
            Response: HTTP response indicating success with user data or error.
        """
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        return Response(user_data, status=status.HTTP_201_CREATED)


class LoginAPIView(generics.GenericAPIView):
    """
    API endpoint for user login.
    """
    serializer_class = LoginSerializer

    @swagger_auto_schema(tags=["Authentication"])
    def post(self, request: HttpRequest) -> HttpResponse:
        """
        Handles user login.
        
        Args:
            request (HttpRequest): The HTTP request object.
        Returns:
            Response: HTTP response indicating success with user data or error.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoguotAPIView(generics.GenericAPIView):
    """
    API endpoint for user logout.
    """
    serializer_class = LogoutSerializer

    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(tags=["Authentication"])
    def post(self, request: HttpRequest) -> HttpResponse:
        """
        Handles user logout.
        
        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: HTTP response indicating success or error.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


