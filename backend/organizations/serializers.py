from rest_framework import serializers
from .models import Organization, Membership,PendingMembership

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at')

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'
        read_only_fields = ('date_joined',)

class PendingMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingMembership
        fields = "__all__"