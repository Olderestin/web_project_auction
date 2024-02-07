from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import TokenError

from user.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    tokens = serializers.SerializerMethodField()

    def get_tokens(self, obj):
        refresh = RefreshToken.for_user(obj)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}

    default_error_messages = {
        "username": "The username should only contain alphanumeric characters"
    }

    class Meta:
        model = User
        fields = ["username", "password", "first_name", "last_name", "tokens"]
        extra_kwargs = {
            "first_name": {"required": False},
            "last_name": {"required": False},
        }

    def validate(self, attrs):
        username = attrs.get("username", "")

        if not username.isalnum():
            raise serializers.ValidationError(self.default_error_messages)
        return attrs

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.is_active = True
        user.save()
        return user


class LoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    username = serializers.CharField(max_length=255)

    tokens = serializers.SerializerMethodField()

    def get_tokens(self, obj):
        user = User.objects.get(username=obj["username"])
        refresh = RefreshToken.for_user(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}

    class Meta:
        model = User
        fields = ["username", "password", "tokens"]

    def validate(self, attrs):
        username = attrs.get("username", "")
        password = attrs.get("password", "")
        user = authenticate(username=username, password=password)

        if not user:
            raise AuthenticationFailed("invalid credentials, try again")

        return {"username": user.username, "tokens": attrs.get("tokens")}


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {"bad_token": "Token is expired or invalid"}

    def validate(self, attrs):
        self.token = attrs["refresh"]
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail("bad_token")


# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'first_name', 'last_name']
