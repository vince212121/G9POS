from datetime import datetime
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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def __str__(self):
        return self.email

    objects = UserManager()

class Inventory(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    quantity = models.IntegerField(default=0)
    quantity_sold = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name

class CustomerProfile(models.Model):
    name = models.CharField(max_length=128)
    email = models.EmailField(max_length=128)
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class PreviousCustomerOrder(models.Model):
    name = models.CharField(max_length=128, default=None, blank=True)
    date_purchased = models.DateTimeField(default=datetime.now, blank=True)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, default=None, null=True, blank=True)

    def __str__(self):
        return f"Customer {self.id}" if self.name is None else self.name

class PreviousVendorOrder(models.Model):
    name = models.CharField(max_length=128)
    date_purchased = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.name


class CustomerOrder(models.Model):
    previousCustomer = models.ForeignKey(PreviousCustomerOrder, on_delete=models.CASCADE)
    item = models.ForeignKey(Inventory, on_delete=models.CASCADE)

    def __str__(self):
        return f"Customer {self.previousCustomer.id}" if self.previousCustomer.name is None else self.previousCustomer.name

class VendorOrder(models.Model):
    previousVendor = models.ForeignKey(PreviousVendorOrder, on_delete=models.CASCADE)
    item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    quantity_ordered = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return self.previousVendor.name