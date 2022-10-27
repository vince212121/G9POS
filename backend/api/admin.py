from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from api.models import Inventory, CustomerProfile, User, VendorOrder, CustomerOrder, Vendor, Category
# Register your models here.

class staffAdmin(UserAdmin):
    list_display = ('email', 'date_joined', 'is_staff')
    search_field = ('is_staff', 'is_superuser', 'groups')
    filter_horizontal = ()
    list_filter = ()
    fieldsets = (
        (
            'Fields',
            {
                'fields': (
                    'email',
                    'last_login',
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'is_owner',
                    'is_employee',
                    'groups',
                    'user_permissions',
                    'password',
                )
            },
        ),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_owner', 'is_employee'),
        }),
    )
    ordering = ("-date_joined",)

admin.site.register(Inventory)
admin.site.register(CustomerProfile)
admin.site.register(CustomerOrder)
admin.site.register(VendorOrder)
admin.site.register(Vendor)
admin.site.register(Category)
admin.site.register(User, staffAdmin)