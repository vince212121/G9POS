from django.contrib import admin

from api.models import Inventory, PreviousCustomerOrder, PreviousVendorOrder, CustomerProfile
# Register your models here.

admin.site.register(Inventory)
admin.site.register(PreviousCustomerOrder)
admin.site.register(PreviousVendorOrder)
admin.site.register(CustomerProfile)