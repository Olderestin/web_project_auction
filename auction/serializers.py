from typing import Any, Dict
from django.utils import timezone
from rest_framework import serializers

from auction.models import Auction
from auction.models import AuctionImage
from auction.models import Bid
from user.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    """
    class Meta:
        model = User
        fields = ["username", "user_image"]


class BidSerializer(serializers.ModelSerializer):
    """
    Serializer for Bid model.
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = "__all__"

    def create(self, validate_data: Dict[str, Any]) -> Bid:
        """
        Method to create a new bid.
        """
        user = self.context["request"].user
        auction = validate_data["auction"]
        bid_value = validate_data["bid"]

        if not auction.bid:
            if auction.start_bid <= bid_value:
                bid = self.create_bid(user, validate_data, auction)
            else:
                raise serializers.ValidationError(
                    "Bid value must be at least equal to the start bid."
                )
        elif (auction.bid + auction.bid_step) <= bid_value:
            bid = self.create_bid(user, validate_data, auction)
        else:
            raise serializers.ValidationError(
                "Bid value must be higher than the current bid plus the bid step."
            )

        return bid

    def create_bid(self, user, validate_data: Dict[str, Any], auction: Auction) -> Bid:
        bid = Bid.objects.create(user=user, **validate_data)
        auction.bid = bid.bid
        auction.save()
        return bid


class AuctionImageSerializer(serializers.ModelSerializer):
    """
    Serializer for AuctionImage model.
    """
    class Meta:
        model = AuctionImage
        fields = "__all__"

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate method to check maximum number of auction images and ownership.
        """
        super().validate(attrs)

        auction = attrs.get("auction")
        if auction.images.count() >= 4:
            raise serializers.ValidationError(
                {"error": "Auction has maximum number of AuctionImages"}
            )

        if auction.owner != self.context["request"].user:
            raise serializers.ValidationError(
                {"error": "Not the owner of this auction"}
            )
        return attrs


class AuctionSerializer(serializers.ModelSerializer):
    """
    Serializer for Auction model.
    """
    owner = UserSerializer(read_only=True)
    images = AuctionImageSerializer(many=True, read_only=True)
    bids = BidSerializer(many=True, read_only=True)
    published_date = serializers.DateTimeField(read_only=True)
    bid = serializers.IntegerField(read_only=True)

    class Meta:
        model = Auction
        fields = [
            "id",
            "owner",
            "published_date",
            "title",
            "description",
            "images",
            "bids",
            "bid",
            "start_bid",
            "bid_step",
        ]

    def create(self, validate_data: Dict[str, Any]) -> Auction:
        """
        Method to create a new auction.
        """
        owner = self.context["request"].user

        auction = Auction.objects.create(
            owner=owner, created_date=timezone.now(), **validate_data
        )
        return auction


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    """
    auction_set = AuctionSerializer(many=True, read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "user_image",
            "first_name",
            "last_name",
            "email",
            "auction_set",
        ]
