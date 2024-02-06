from user.models import User
from auction.models import Auction, AuctionImage, Bid
from .serializers import AuctionSerializer, BidSerializer, AuctionImageSerializer, UserProfileSerializer
from rest_framework import permissions, viewsets, mixins, parsers
from .permissions import IsOwner, ProfileIsOwner, AuctionImageIsOwner
from django.shortcuts import get_object_or_404


class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwner]
        return (permission() for permission in permission_classes)

class AuctionImageViewSet(mixins.CreateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    queryset = AuctionImage.objects.all()
    serializer_class = AuctionImageSerializer
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.FileUploadParser)

    permission_classes = (permissions.IsAuthenticated, AuctionImageIsOwner, )

class BidViewSet(mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ProfileViewSet(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    lookup_field = 'username'

    http_method_names = ['get', 'patch']

    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.FileUploadParser)
    
    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, ProfileIsOwner]
        return (permission() for permission in permission_classes)
    
    def get_object(self):
        queryset = self.get_queryset()

        lookup_value = self.kwargs[self.lookup_field]

        obj = get_object_or_404(queryset, **{self.lookup_field: lookup_value})
        self.check_object_permissions(self.request, obj)
        return obj


