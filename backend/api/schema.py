# import graphene

# class Query(graphene.ObjectType):
#     hello = graphene.String(default_value="Hi!")

# schema = graphene.Schema(query=Query)

# schema
# TODO: Import graphene and models
# Then create the types for the models and the query, post, delete, etc.
# https://docs.graphene-python.org/projects/django/en/latest/
# https://docs.graphene-python.org/projects/django/en/latest/tutorial-plain/

import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from api.models import (
    Inventory, 
    VendorOrder, 
    CustomerOrder, 
    CustomerProfile,
    Category,
    Vendor,
    # PreviousCustomerOrder,
    # PreviousVendorOrder,
    # CustomerItems
)
from graphene.types.generic import GenericScalar

# class UserType(DjangoObjectType):
#     class Meta:
#         model = get_user_model()

class InventoryType(DjangoObjectType):
    # name = graphene.String()
    # description = graphene.String()
    # quantity = graphene.Int()
    # quantity_sold = graphene.Int()
    # price = graphene.Float()
    # data = graphene.List()

    class Meta:
        model = Inventory

# Queries
# class Inventory(DjangoObjectType):
#     name = graphene.String()
#     description = graphene.String()
#     quantity = graphene.Int()
#     quantity_sold = graphene.Int()
#     price = graphene.Float()
    
# class CustomerOrderType(DjangoObjectType):
#     class Meta:
#         model = CustomerOrder

# class VendorOrderType(DjangoObjectType):
#     class Meta:
#         model = VendorOrder

class CustomerType(DjangoObjectType):
    class Meta:
        model = CustomerProfile

class VendorType(DjangoObjectType):
    class Meta:
        model = Vendor

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

# https://docs.djangoproject.com/en/4.1/topics/db/queries/
class Query(graphene.ObjectType):
    # product = graphene.Field(InventoryType, name=graphene.String(required=True))
    # product_by_name = graphene.List(InventoryType, name=graphene.String(required=True))
    product = GenericScalar()
    # product_by_name = GenericScalar(name=graphene.String(required=True))
    # product_by_category = graphene.List(InventoryType, category_name=graphene.String(required=True))
    # product_by_category = GenericScalar(category_name=graphene.String(required=True))
    # customer_order = graphene.List(CustomerOrderType, id=graphene.Int(required=True))
    # customer_order = GenericScalar(id=graphene.Int(required=True))
    customer_order = GenericScalar()
    vendor_order = GenericScalar()
    # customer_orders_by_customerid = GenericScalar(customerid=graphene.Int(required=True))
    # customer_order = graphene.List(CustomerOrderType, id=graphene.Int(required=True), customerid=graphene.Int())
    # vendor_order = graphene.List(VendorOrderType, vendorName=graphene.String(required=True))
    customer = graphene.List(CustomerType, name=graphene.String(required=True))
    vendor = graphene.List(VendorType, name=graphene.String(required=True))
    category = graphene.List(CategoryType, name=graphene.String(required=True))

    # customer_order = graphene.Field(CustomerOrder)
    # vendor_order = graphene.Field(CustomerOrder)
    # customer = graphene.Field(Customer)

    def resolve_product(self, info):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        items = Inventory.objects.all()
        return [
            {
                "id": item.id,
                "brand": item.brand,
                "vendor": {
                    "name": item.vendor.name,
                    "email": item.vendor.email,
                    "phone": item.vendor.phone_number,
                },
                "category": {
                    "id": item.category.id,
                    "name": item.category.name
                },
                "description": item.description,
                "quantity": item.quantity,
                "quantity_sold": item.quantity_sold,
                "price": f"{item.price}"
            }
            for item in items
        ]

    # Could probably filter this in the front end
    # def resolve_product_by_name(self, info, name):
    #     # return Inventory.objects.filter(name=name).first()
    #     user = info.context.user
    #     if user.is_anonymous:
    #         return {"ok": False, "message": "Not Logged in", "status": 401}
    #     # return Inventory.objects.filter(name=name)
    #     items = Inventory.objects.filter(name=name)
    #     return [
    #         {
    #             "id": item.id,
    #             "brand": item.brand,
    #             "vendor": {
    #                 "name": item.vendor.name,
    #                 "email": item.vendor.email,
    #                 "phone": item.vendor.phone_number,
    #             },
    #             "category": {
    #                 "id": item.category.id,
    #                 "name": item.category.name
    #             },
    #             "description": item.description,
    #             "quantity": item.quantity,
    #             "quantity_sold": item.quantity_sold,
    #             "price": f"{item.price}"
    #         }
    #         for item in items
    #     ]

    # def resolve_product_by_category(self, info, category_name):
    #     user = info.context.user
    #     if user.is_anonymous:
    #         return {"ok": False, "message": "Not Logged in", "status": 401}
    #     category = Category.objects.filter(name=category_name).first()
    #     # return Inventory.objects.filter(category=category)
    #     items = Inventory.objects.filter(category=category)
    #     return [
    #         {
    #             "id": item.id,
    #             "brand": item.brand,
    #             "vendor": {
    #                 "name": item.vendor.name,
    #                 "email": item.vendor.email,
    #                 "phone": item.vendor.phone_number,
    #             },
    #             "category": {
    #                 "id": item.category.id,
    #                 "name": item.category.name
    #             },
    #             "description": item.description,
    #             "quantity": item.quantity,
    #             "quantity_sold": item.quantity_sold,
    #             "price": f"{item.price}"
    #         }
    #         for item in items
    #     ]

    # def resolve_customer_order(self, info, id):
    #     return CustomerOrder.objects.filter(id=id)

    # def resolve_customer_orders_by_customerid(self, info, customerid):
    #     user = info.context.user
    #     if user.is_anonymous:
    #         return {"ok": False, "message": "Not Logged in", "status": 401}
    #     # customer: PreviousCustomerOrder = PreviousCustomerOrder.objects.filter(id=customerid).first()
    #     # orders: CustomerOrder = CustomerOrder.objects.filter(previousCustomer=customer)
    #     customer: CustomerProfile = CustomerProfile.objects.filter(id=customerid).first()
    #     # orders: PreviousCustomerOrder = PreviousCustomerOrder.objects.filter(customer=customer)
    #     # items: CustomerItems = CustomerItems.objects.filter(items=orders).first()
    #     # print(items)
    #     return [
    #         {
    #             "id": customerid
    #             # "id": order.id,
    #             # "customer": {
    #             #     "name": order.previousCustomer.customer.name,
    #             #     "email": order.previousCustomer.customer.email,
    #             #     "phone": order.previousCustomer.customer.phone_number 
    #             # },
    #             # "item": {
    #             #     "name": order.item.name,
    #             #     "description": order.item.description,
    #             #     "quantity": order.item.quantity,
    #             #     "quantity_sold": order.item.quantity_sold,
    #             #     "price": f"{order.item.price}",
    #             # }
    #         }
    #         # for order in orders
    #     ]

    def resolve_customer_order(self, info):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        orders: CustomerOrder = CustomerOrder.objects.all()
        ordersCollection = []
        for order in orders:
            ordersCollection.append({
                "id": order.id,
                "date_purchased": f"{order.date_purchased.year}/{order.date_purchased.month}/{order.date_purchased.day}",
                "items": [
                    {
                        "id": item.id,
                        "brand": item.brand,
                        "vendor": {
                            "name": item.vendor.name,
                            "email": item.vendor.email,
                            "phone": item.vendor.phone_number,
                        },
                        "category": {
                            "id": item.category.id,
                            "name": item.category.name
                        },
                        "description": item.description,
                        "quantity": item.quantity,
                        "quantity_sold": item.quantity_sold,
                        "price": f"{item.price}"
                    }
                    for item in order.items.all()
                ],
                "customer": {
                    "id": order.customer.id,
                    "name": order.customer.name,
                    "email": order.customer.email,
                    "phone": order.customer.phone_number 
                } if order.customer is not None else None,
            })
        return ordersCollection

    def resolve_vendor_order(self, info):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        orders: VendorOrder = VendorOrder.objects.all()
        ordersCollection = []
        for order in orders:
            ordersCollection.append({
                "id": order.id,
                "vendor": {
                    "id": order.vendor.id,
                    "name": order.vendor.name,
                    "email": order.vendor.email,
                    "phone": order.vendor.phone_number 
                },
                "quantity_ordered": order.quantity_ordered,
                "date_purchased": f"{order.date_purchased.year}/{order.date_purchased.month}/{order.date_purchased.day}",
                "items": [
                    {
                        "id": item.id,
                        "brand": item.brand,
                        "vendor": {
                            "name": item.vendor.name,
                            "email": item.vendor.email,
                            "phone": item.vendor.phone_number,
                        },
                        "category": {
                            "id": item.category.id,
                            "name": item.category.name
                        },
                        "description": item.description,
                        "quantity": item.quantity,
                        "quantity_sold": item.quantity_sold,
                        "price": f"{item.price}"
                    }
                    for item in order.items.all()
                ],
            })
        return ordersCollection

    # def resolve_customer_order(self, info, id):
    #     user = info.context.user
    #     if user.is_anonymous:
    #         return {"ok": False, "message": "Not Logged in", "status": 401}
    #     order: CustomerOrder = CustomerOrder.objects.filter(id=id).first()
    #     return {
    #         "id": id,
    #         "customer": {
    #             "name": order.previousCustomer.customer.name,
    #             "email": order.previousCustomer.customer.email,
    #             "phone": order.previousCustomer.customer.phone_number 
    #         } if order.previousCustomer.customer is not None else None,
    #         "item": {
    #             "name": order.item.name,
    #             "description": order.item.description,
    #             "quantity": order.item.quantity,
    #             "quantity_sold": order.item.quantity_sold,
    #             "price": f"{order.item.price}",
    #         }
    #     }

    # TODO: fix this to show vendors and items
    # def resolve_vendor_order(self, info, vendorName):
    #     user = info.context.user
    #     if user.is_anonymous:
    #         return {"ok": False, "message": "Not Logged in", "status": 401}
    #     vendor = PreviousVendorOrder.objects.filter(name=vendorName).first()
    #     return VendorOrder.objects.filter(previousVendor=vendor)
    
    def resolve_customer(self, info, name):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        return CustomerProfile.objects.filter(name=name)

    def resolve_vendor(self, info, name):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        return Vendor.objects.filter(name=name)

    def resolve_category(self, info, name):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        return Category.objects.filter(name=name)

# schema
# TODO: Import graphene and models
# Then create the types for the models and the query, post, delete, etc.
# https://docs.graphene-python.org/projects/django/en/latest/

# Mutations
# Products/Inventory
class ProductMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        category = GenericScalar(required=True)
        vendor = GenericScalar(required=True)
        name = graphene.String(required=True)
        brand = graphene.String(required=True)
        description = graphene.String(required=True)
        quantity = graphene.Int(required=True)
        quantity_sold = graphene.Int(required=True)
        price = graphene.Float(required=True)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, category, vendor, name, brand, description, quantity, quantity_sold, price):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        
        action = action.lower()
        
        if action != "add" or action != "update":
            try:
                cat = Category.objects.get(name=category.get("name"))
                ven = Vendor.objects.get(name=vendor.get("name"))
                ven.email = vendor.get("email")
                ven.phone_number = vendor.get("phone_number")
                ven.save(update_fields=["email","phone_number"])
            except:
                return ProductMutation(ok=False, status=200, message="Category or vendor doesn't exist")
        
        if action == "add":
            Inventory.objects.create(
                category=cat,
                vendor=ven,
                brand=brand,
                name=name, 
                description=description, 
                quantity=quantity, 
                quantity_sold=quantity_sold, 
                price=price
            )
            return ProductMutation(ok=True, status=200, message="Product added")
        elif action == "update":
            prod: Inventory = Inventory.objects.get(name=name, vendor=ven)
            prod.category = cat
            prod.brand = brand
            prod.description = description
            prod.quantity = quantity
            prod.quantity_sold = quantity_sold
            prod.price = price
            prod.save()
            return ProductMutation(ok=True, status=200, message="Product updated")
        elif action == "delete":
            try:
                prod: Inventory = Inventory.objects.get(name=name, vendor=ven)
                prod.delete()
                return ProductMutation(ok=True, status=200, message="Product deleted")
            except:
                return ProductMutation(ok=False, status=400, message="Product doesn't exist")
        else:
            return ProductMutation(ok=False, status=400, message="Invalid action")

# Vendors
class VendorMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        updated_email = graphene.String(default_value=None)
        phone = graphene.String(default_value=None)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, name, email, updated_email, phone):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        
        action = action.lower()

        if action == "add":
            vendor, created = Vendor.objects.get_or_create(name=name, email=email)
            vendor.phone_number = phone
            vendor.save(update_fields=["phone_number"])
            if created:
                return VendorMutation(ok=True, status=200, message="Vendor added")
            else:
                return VendorMutation(ok=False, status=400, message="Vendor exists")
        elif action == "update":
            try:
                vendor = Vendor.objects.get(
                    name=name,
                    email=email,
                )
                vendor.email = updated_email if updated_email is not None else email
                vendor.phone_number = phone
                vendor.save(update_fields=["phone_number", "email"])
                return VendorMutation(ok=True, status=200, message="Vendor updated")
            except:
                return VendorMutation(ok=False, status=400, message="Vendor doesn't exist")
        elif action == "delete":
            try:
                vendor = Vendor.objects.get(
                    name=name,
                    email=email,
                )
                vendor.delete()
                return VendorMutation(ok=True, status=200, message="Vendor deleted")
            except:
                return VendorMutation(ok=False, status=400, message="Vendor doesn't exist")
        else:
            return VendorMutation(ok=False, status=400, message="Invalid Action")

# Vendor orders
class VendorOrderMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        date_purchased = graphene.DateTime(required=True)
        vendor = GenericScalar()
        items = GenericScalar()
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, date_purchased, vendor, items):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        
        action = action.lower()

        if action == "add":
            return VendorOrderMutation(ok=True, status=200, message="Vendor Order added")
        elif action == "update":
            return VendorOrderMutation(ok=True, status=200, message="Vendor Order updated")
        elif action == "delete":
            try:
                return VendorOrderMutation(ok=True, status=200, message="Vendor Order deleted")
            except:
                return VendorOrderMutation(ok=False, status=400, message="Vendor Order doesn't exist")
        else:
            return VendorOrderMutation(ok=False, status=400, message="Invalid Action")
        

# Customer
class CustomerMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        name = graphene.String(required=True)
        email = graphene.String()
        updated_email = graphene.String(default_value=None)
        phone = graphene.String(default_value=None)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, name, email, updated_email, phone):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        
        action = action.lower()

        if action == "add":
            customer, created = CustomerProfile.objects.get_or_create(
                name=name,
                email=email,
            )
            customer.phone_number = phone
            customer.save(update_fields=["phone_number"])
            if created:
                return CustomerMutation(ok=True, status=200, message="Customer added")
            else:
                return CustomerMutation(ok=False, status=400, message="Customer exists")
        elif action == "update":
            try:
                customer = CustomerProfile.objects.get(
                    name=name,
                    email=email,
                )
                customer.email = updated_email if updated_email is not None else email
                customer.phone_number = phone
                customer.save(update_fields=["phone_number", "email"])
                return CustomerMutation(ok=True, status=200, message="Customer updated")
            except:
                return CustomerMutation(ok=False, status=400, message="Customer doesn't exist")
        elif action == "delete":
            try:
                customer = CustomerProfile.objects.get(
                    name=name,
                    email=email,
                )
                customer.delete()
                return CustomerMutation(ok=True, status=200, message="Customer deleted")
            except:
                return CustomerMutation(ok=False, status=400, message="Customer doesn't exist")
        else:
            return CustomerMutation(ok=False, status=400, message="Invalid Action")

# Customer Orders
class CustomerOrderMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        date_purchased = graphene.DateTime(required=True)
        customer = GenericScalar()
        items = GenericScalar()
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, date_purchased, customer, items):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        
        action = action.lower()

        if action == "add":
            return CustomerOrderMutation(ok=True, status=200, message="Customer Order added")
        elif action == "update":
            return CustomerOrderMutation(ok=True, status=200, message="Customer Order updated")
        elif action == "delete":
            try:
                return CustomerOrderMutation(ok=True, status=200, message="Customer Order deleted")
            except:
                return CustomerOrderMutation(ok=False, status=400, message="Customer Order doesn't exist")
        else:
            return CustomerOrderMutation(ok=False, status=400, message="Invalid Action")

# Categories
class CategoryMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        name = graphene.String(required=True)
        updated_name = graphene.String(default_value=None)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, name, updated_name):
        user = info.context.user
        if user.is_anonymous:
            return {"ok": False, "message": "Not Logged in", "status": 401}
        
        action = action.lower()

        if action == "add":
            category, created = Category.objects.get_or_create(name=name)
            if created:
                return CategoryMutation(ok=True, status=200, message="Category added")
            else:
                return CategoryMutation(ok=False, status=400, message="Category already exists")
        elif action == "update":
            try:
                category = Category.objects.get(name=name)
                category.name = updated_name if updated_name is not None else name
                category.save(update_fields=["name"])
                return CategoryMutation(ok=True, status=200, message="Category updated")
            except:
                return CategoryMutation(ok=False, status=400, message="Category doesn't exists")
        elif action == "delete":
            try:
                category = Category.objects.get(name=name)
                category.delete()
                return CategoryMutation(ok=True, status=200, message="Category deleted")
            except:
                return CategoryMutation(ok=False, status=400, message="Category doesn't exist")
        else:
            return CategoryMutation(ok=False, status=400, message="Invalid Action")

# Users
# https://www.howtographql.com/graphql-python/4-authentication/
class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        is_owner = graphene.Boolean(required=True)
        is_employee = graphene.Boolean(required=True)

    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, email, password, is_owner, is_employee):
        if (is_owner):
            user = get_user_model() (
                email=email,
                is_owner=is_owner,
                is_employee=is_employee
            )
            user.set_password(password)
            user.save()
        elif (is_employee):
            user = get_user_model() (
                email=email,
                is_employee=is_employee
            )
            user.set_password(password)
            user.save()
        return CreateUser(ok=True, status="200", message="User created")

class Mutations(graphene.ObjectType):
    product_mutation = ProductMutation.Field()
    vendor_mutation = VendorMutation.Field()
    vendor_order_mutation = VendorOrderMutation.Field()
    customer_mutation = CustomerMutation.Field()
    customer_order_mutation = CustomerOrderMutation.Field()
    category_mutation = CategoryMutation.Field()
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutations)