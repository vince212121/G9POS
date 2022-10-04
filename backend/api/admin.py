from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from api.models import Inventory, PreviousCustomerOrder, PreviousVendorOrder, CustomerProfile, User
# Register your models here.

class staffAdmin(UserAdmin):
    list_display = ('email', 'date_joined')
    search_field = ('is_staff', 'is_superuser', 'groups')
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
    ordering = ("-date_joined",)

admin.site.register(Inventory)
admin.site.register(PreviousCustomerOrder)
admin.site.register(PreviousVendorOrder)
admin.site.register(CustomerProfile)
admin.site.register(User, staffAdmin)