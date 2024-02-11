from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AuctionImageViewSet
from .views import AuctionViewSet
from .views import BidViewSet
from .views import ProfileViewSet

router = DefaultRouter()
router.register(r"auctions", AuctionViewSet)
router.register(r"auction-images", AuctionImageViewSet)
router.register(r"bid", BidViewSet)
router.register(r"profile", ProfileViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
