from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        user = self.model(
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False, help_text='Used to access admin page') 
    is_owner = models.BooleanField(default=False, help_text='Used for owner privilege')
    is_employee = models.BooleanField(default=False, help_text='Used for employee privilege')
    date_joined = models.DateTimeField(verbose_name="date joined", auto_now_add=True)
    store_name = models.CharField(max_length=64, help_text='Users store', default="Store Name")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def __str__(self):
        return f"{self.store_name} - {self.email}"

    objects = UserManager()

class Vendor(models.Model):
    name = models.CharField(max_length=128)
    email = models.EmailField(max_length=128)
    phone_number = models.CharField(max_length=15, default=None, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=128)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

class Inventory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    brand = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    description = models.TextField()
    quantity = models.IntegerField(default=0)
    quantity_sold = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class CustomerProfile(models.Model):
    name = models.CharField(max_length=128)
    email = models.EmailField(max_length=128)
    phone_number = models.CharField(max_length=15, default=None, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class CustomerOrder(models.Model):
    date_purchased = models.DateTimeField(auto_now_add=True, blank=True)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, default=None, null=True, blank=True)
    items = models.ManyToManyField(Inventory)
    total_cost = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Customer {self.id}" if self.customer is None else f"Customer {self.id} - {self.customer.name}"
class VendorOrder(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    date_purchased = models.DateTimeField(auto_now_add=True, blank=True)
    items = models.ManyToManyField(Inventory)
    quantity_ordered = models.IntegerField()
    total_cost = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"vendor {self.id} - {self.vendor.name}"