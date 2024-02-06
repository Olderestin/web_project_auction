from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import generics, status, permissions

from user.serializers import LoginSerializer, LogoutSerializer, RegisterSerializer

class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer

    @swagger_auto_schema(tags=['Authentication'])
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        return Response(user_data, status=status.HTTP_201_CREATED)
    
class LoginAPIView(generics.GenericAPIView):

    serializer_class = LoginSerializer

    @swagger_auto_schema(tags=['Authentication'])
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LoguotAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (permissions.IsAuthenticated, )

    @swagger_auto_schema(tags=['Authentication'])
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
# class UserProfileView(generics.RetrieveAPIView):
#     serializer_class = UserProfileSerializer

#     permission_classes = (permissions.IsAuthenticated, )

#     def get_object(self):
#         return self.request.user


