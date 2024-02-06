from rest_framework import serializers
from user.models import User
from auction.models import Auction, Bid, AuctionImage
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class BidSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = '__all__'

    def create(self, validate_data):
        user = self.context['request'].user
        bid = Bid.objects.create(user=user, **validate_data)

        auction = validate_data['auction']
        auction.bid = bid.bid
        auction.save()

        return bid

class AuctionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionImage
        fields = '__all__'

    def validate(self, attrs):
        super().validate(attrs)

        auction = attrs.get('auction')
        if auction.images.count() >= 4:
            raise serializers.ValidationError({'error': 'Auction has maximum number of AuctionImages'})
        
        if auction.owner != self.context['request'].user:
            raise serializers.ValidationError({'error': 'Not the owner of this auction'})
        return attrs

class AuctionSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    images = AuctionImageSerializer(many=True, read_only=True)
    bids = BidSerializer(many=True, read_only=True)
    published_date = serializers.DateTimeField(read_only=True)
    bid = serializers.IntegerField(read_only=True)

    class Meta:
        model = Auction
        fields = ['id', 'owner', 'published_date', 'title', 'description', 'images', 'bids', 'bid', "start_bid","bid_step"]

    def create(self, validate_data):
        owner = self.context['request'].user
        
        auction = Auction.objects.create(owner=owner, created_date=timezone.now(), **validate_data)
        return auction
    
class UserProfileSerializer(serializers.ModelSerializer):
    auction_set = AuctionSerializer(many=True, read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'auction_set']