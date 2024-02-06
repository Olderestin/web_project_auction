from django.urls import path, include
from .views import AuctionViewSet, BidViewSet, AuctionImageViewSet, ProfileViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'auctions', AuctionViewSet)
router.register(r'auction-images', AuctionImageViewSet)
router.register(r'bid', BidViewSet)
router.register(r'profile', ProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]