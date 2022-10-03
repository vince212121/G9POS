from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        user = self.model(
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None):
        user = self.create_superuser(
            email=self.normalize_email(email),
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=128, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(verbose_name="date joined", auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

class Inventory(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    stock = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

class PreviousCustomerOrder(models.Model):
    name = models.CharField(max_length=128)


class PreviousVendorOrder(models.Model):
    name = models.CharField(max_length=128)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    quantity_ordered = models.IntegerField()

class CustomerProfile(models.Model):
    name = models.CharField(max_length=128)
    email = models.EmailField(max_length=128)
    phone_number = models.CharField(max_length=15)