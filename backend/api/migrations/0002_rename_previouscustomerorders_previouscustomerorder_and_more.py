# Generated by Django 4.1.1 on 2022-10-03 01:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PreviousCustomerOrders',
            new_name='PreviousCustomerOrder',
        ),
        migrations.RenameModel(
            old_name='PreviousVendorOrders',
            new_name='PreviousVendorOrder',
        ),
    ]
