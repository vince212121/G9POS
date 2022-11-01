import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model, authenticate
from api.models import (
    Inventory, 
    VendorOrder, 
    CustomerOrder, 
    CustomerProfile,
    Category,
    Vendor,
    User,
)
from graphql_jwt.utils import jwt_payload, jwt_encode, jwt_decode
from graphene.types.generic import GenericScalar

class CustomerType(DjangoObjectType):
    class Meta:
        model = CustomerProfile

class VendorType(DjangoObjectType):
    class Meta:
        model = Vendor

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

class Query(graphene.ObjectType):
    product = GenericScalar(user_token=graphene.String())
    customer_order = GenericScalar(user_token=graphene.String())
    vendor_order = GenericScalar(user_token=graphene.String())
    customer = graphene.List(CustomerType, user_token=graphene.String())
    vendor = graphene.List(VendorType, user_token=graphene.String())
    category = graphene.List(CategoryType, user_token=graphene.String())
    store_name = GenericScalar(user_token=graphene.String())

    def resolve_product(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        items = Inventory.objects.filter(user=user)
        return [
            {
                "id": item.id,
                "brand": item.brand,
                "name": item.name,
                "vendor": {
                    "name": item.vendor.name,
                    "email": item.vendor.email,
                    "phone_number": item.vendor.phone_number,
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

    def resolve_customer_order(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}
            
        orders: CustomerOrder = CustomerOrder.objects.filter(user=user)
        ordersCollection = []
        for order in orders:
            ordersCollection.append({
                "id": order.id,
                "date_purchased": f"{order.date_purchased.year}/{order.date_purchased.month}/{order.date_purchased.day}",
                "items": [
                    {
                        "id": item.id,
                        "name": item.name,
                        "brand": item.brand,
                        "vendor": {
                            "name": item.vendor.name,
                            "email": item.vendor.email,
                            "phone_number": item.vendor.phone_number,
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
                    "phone_number": order.customer.phone_number 
                } if order.customer is not None else None,
                "total_cost": f"{order.total_cost}",
            })
        return ordersCollection

    def resolve_vendor_order(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        orders: VendorOrder = VendorOrder.objects.filter(user=user)
        ordersCollection = []
        for order in orders:
            ordersCollection.append({
                "id": order.id,
                "vendor": {
                    "id": order.vendor.id,
                    "name": order.vendor.name,
                    "email": order.vendor.email,
                    "phone_number": order.vendor.phone_number 
                },
                "quantity_ordered": order.quantity_ordered,
                "date_purchased": f"{order.date_purchased.year}/{order.date_purchased.month}/{order.date_purchased.day}",
                "items": [
                    {
                        "id": item.id,
                        "brand": item.brand,
                        "name": item.name,
                        "vendor": {
                            "name": item.vendor.name,
                            "email": item.vendor.email,
                            "phone_number": item.vendor.phone_number,
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
                "total_cost": f"{order.total_cost}",
            })
        return ordersCollection

    def resolve_customer(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()
        return CustomerProfile.objects.filter(user=user)

    def resolve_vendor(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()
        return Vendor.objects.filter(user=user)

    def resolve_category(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()
        return Category.objects.filter(user=user)

    def resolve_store_name(self, info, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
            return {"store": user.store_name}
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

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
        user_token = graphene.String(required=True)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, category, vendor, name, brand, description, quantity, quantity_sold, price, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        action = action.lower()
        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()
        try:
            cat = Category.objects.get(name=category.get("name"))
            ven = Vendor.objects.get(name=vendor.get("name"), email=vendor.get("email"))
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
                price=price,
                user=user
            )
            return ProductMutation(ok=True, status=200, message="Product added")
        elif action == "update":
            prod: Inventory = Inventory.objects.get(name=name, vendor=ven, user=user)
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
                prod: Inventory = Inventory.objects.get(name=name, vendor=ven, category=cat, user=user)
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
        user_token = graphene.String(required=True)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, name, email, updated_email, phone, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        action = action.lower()
        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()

        if action == "add":
            vendor, created = Vendor.objects.get_or_create(name=name, email=email, user=user)
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
                    user=user,
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
                    user=user,
                )
                vendor.delete()
                return VendorMutation(ok=True, status=200, message="Vendor deleted")
            except:
                return VendorMutation(ok=False, status=400, message="Vendor doesn't exist")
        else:
            return VendorMutation(ok=False, status=400, message="Invalid Action")

# Vendor orders
# item requires: category, name, and brand
class VendorOrderMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        order_id = graphene.Int(default_value=None)
        vendor_data = GenericScalar(default_value=None)
        items = GenericScalar(required=True)
        original_items = GenericScalar(required=True)
        quantity_ordered = graphene.Int(required=True)
        user_token = graphene.String(required=True)

    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, vendor_data, order_id, items, original_items, quantity_ordered, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        action = action.lower()
        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()

        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()
        vendor = None
        if action == "add":
            if vendor_data is not None:
                if vendor_data.get("email") is None or vendor_data.get("name") is None:
                    return {"ok": False, "message": "Missing name or email", "status": 400}
                vendor, created = Vendor.objects.get_or_create(name=vendor_data.get("name"), email=vendor_data.get("email"))
                vendorOrder: VendorOrder = VendorOrder.objects.create(
                    vendor=vendor,
                    quantity_ordered=quantity_ordered
                )
            vendorOrder.total_cost = 0
            for item in items:
                category: Category = Category.objects.get(name=item.get("category").get("name"))
                inventory: Inventory = Inventory.objects.get(
                    category=category,
                    vendor=vendor,
                    name=item.get("name"),
                    brand=item.get("brand"),
                    user=user
                )
                inventory.quantity += quantity_ordered
                inventory.save(update_fields=["quantity"])

                vendorOrder.total_cost += inventory.price * quantity_ordered
                vendorOrder.save(update_fields=["total_cost"])
                vendorOrder.items.add(inventory)

            return VendorOrderMutation(ok=True, status=200, message="Vendor Order added")
        elif action == "update":
            try:
                if order_id is not None:
                    vendorOrder: VendorOrder = VendorOrder.objects.get(id=order_id)
                else:
                    return VendorOrderMutation(ok=False, status=400, message="Vendor Order doesn't exist") 
                vendorOrder.items.clear()
                vendorOrder.total_cost = 0
                for item in items:
                    category: Category = Category.objects.get(name=item.get("category").get("name"))
                    vendor: Vendor = Vendor.objects.get(
                        name=vendor_data.get("name"),
                        email=vendor_data.get("email")
                    )
                    inventory: Inventory = Inventory.objects.get(
                        category=category,
                        vendor=vendor,
                        name=item.get("name"),
                        brand=item.get("brand"),
                        user=user
                    )
                    # updating with new data
                    if item not in original_items:
                        inventory.quantity += quantity_ordered if quantity_ordered is not vendorOrder.quantity_ordered else vendorOrder.quantity_ordered
                        inventory.save(update_fields=["quantity"])
                    
                    
                    vendorOrder.total_cost += inventory.price * quantity_ordered
                    vendorOrder.items.add(inventory)
                    vendorOrder.save(update_fields=["total_cost"])
                    
                for item in original_items:
                    category: Category = Category.objects.get(name=item.get("category").get("name"))
                    vendor: Vendor = Vendor.objects.get(
                        name=vendor_data.get("name"),
                        email=vendor_data.get("email")
                    )
                    inventory: Inventory = Inventory.objects.get(
                        category=category,
                        vendor=vendor,
                        name=item.get("name"),
                        brand=item.get("brand"),
                        user=user
                    )

                    if item not in items:
                        inventory.quantity -= vendorOrder.quantity_ordered
                        if inventory.quantity < 0:
                            inventory.quantity = 0
                        inventory.save(update_fields=["quantity"])

                vendorOrder.quantity_ordered = quantity_ordered
                vendorOrder.save(update_fields=["quantity_ordered"])

                return VendorOrderMutation(ok=True, status=200, message="Vendor Order updated")
            except:
                return VendorOrderMutation(ok=False, status=400, message="Vendor Order unable to update")
        elif action == "delete":
            try:
                if order_id is not None:
                    vendorOrder = VendorOrder.objects.get(id=order_id)
                    for item in original_items:
                        category: Category = Category.objects.get(name=item.get("category").get("name"))
                        vendor: Vendor = Vendor.objects.get(
                            name=item.get("vendor").get("name"),
                            email=item.get("vendor").get("email"),
                        )
                        inventory:Inventory = Inventory.objects.get(
                            category=category,
                            vendor=vendor,
                            name=item.get("name"), 
                            brand=item.get("brand"),
                            user=user,
                        )

                        inventory.quantity -= vendorOrder.quantity_ordered
                        inventory.save(update_fields=["quantity"])
                    
                    vendorOrder.delete()
                else:
                    return VendorOrderMutation(ok=False, status=400, message="Vendor Order doesn't exist")
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
        user_token = graphene.String(required=True)
    
    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, name, email, updated_email, phone, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        action = action.lower()
        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()

        if action == "add":
            customer, created = CustomerProfile.objects.get_or_create(
                name=name,
                email=email,
                user=user,
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
                    user=user,
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
                    user=user,
                )
                customer.delete()
                return CustomerMutation(ok=True, status=200, message="Customer deleted")
            except:
                return CustomerMutation(ok=False, status=400, message="Customer doesn't exist")
        else:
            return CustomerMutation(ok=False, status=400, message="Invalid Action")

# Customer Orders
# item requires: vendor, category, name, and brand
class CustomerOrderMutation(graphene.Mutation):
    class Arguments:
        action = graphene.String(required=True)
        order_id = graphene.Int(default_value=None)
        customer_data = GenericScalar(default_value=None)
        items = GenericScalar(required=True)
        original_items = GenericScalar(required=True)
        user_token = graphene.String(required=True)

    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, customer_data, items, original_items, order_id, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        action = action.lower()
        email: get_user_model = jwt_decode(user_token).get("email")
        user: User = User.objects.filter(email=email).first()
        customer = None
        if action == "add":
            if customer_data is not None:
                if customer_data.get("email") is None or customer_data.get("name") is None:
                    return {"ok": False, "message": "Missing name or email", "status": 400}
                customer = CustomerProfile.objects.get_or_create(name=customer_data.get("name"), email=customer_data.get("email"))
            customerOrder = CustomerOrder.objects.create(
                customer=customer[0] if customer_data is not None else None
            )
            customerOrder.total_cost = 0
            for item in items:
                category: Category = Category.objects.get(name=item.get("category").get("name"))
                vendor: Vendor = Vendor.objects.get(
                    name=item.get("vendor").get("name"),
                    email=item.get("vendor").get("email"),
                )

                inventory = Inventory.objects.get(
                    category=category,
                    vendor=vendor,
                    name=item.get("name"), 
                    brand=item.get("brand"),
                    user=user
                )
                # updating quantity and sold
                inventory.quantity -= 1 if inventory.quantity > 0 else 0
                inventory.quantity_sold += 1 if inventory.quantity > 0 else 0
                inventory.save(update_fields=["quantity", "quantity_sold"])
                
                # updating order total
                customerOrder.items.add(inventory)
                customerOrder.total_cost += inventory.price if inventory.quantity > 0 else 0
                customerOrder.save(update_fields=["total_cost"])
            
            return CustomerOrderMutation(ok=True, status=200, message="Customer Order added")
        elif action == "update":
            try:
                if order_id is not None:
                    customerOrder = CustomerOrder.objects.get(id=order_id, user=user)
                else:
                    return CustomerOrderMutation(ok=False, status=400, message="Customer Order doesn't exist")
                
                # Reset customer items
                customerOrder.items.clear()
                customerOrder.total_cost = 0

                for item in items:
                    category: Category = Category.objects.get(name=item.get("category").get("name"))
                    vendor: Vendor = Vendor.objects.get(
                        name=item.get("vendor").get("name"),
                        email=item.get("vendor").get("email"),
                    )
                    inventory:Inventory = Inventory.objects.get(
                        category=category,
                        vendor=vendor,
                        name=item.get("name"), 
                        brand=item.get("brand"),
                        user=user,
                    )

                    if item not in original_items:
                        inventory.quantity -= 1 if inventory.quantity > 0 else 0
                        inventory.quantity_sold += 1 
                        inventory.save(update_fields=["quantity", "quantity_sold"])
                        

                    # Append updated items
                    customerOrder.items.add(inventory)
                    customerOrder.total_cost += inventory.price if inventory.quantity > 0 else 0
                    customerOrder.save(update_fields=["total_cost"])

                for item in original_items:
                    category: Category = Category.objects.get(name=item.get("category").get("name"))
                    vendor: Vendor = Vendor.objects.get(
                        name=item.get("vendor").get("name"),
                        email=item.get("vendor").get("email"),
                    )
                    inventory:Inventory = Inventory.objects.get(
                        category=category,
                        vendor=vendor,
                        name=item.get("name"), 
                        brand=item.get("brand"),
                        user=user,
                    )

                    if item not in items:
                        inventory.quantity += 1 
                        inventory.quantity_sold -= 1 if inventory.quantity_sold > 0 else 0
                        inventory.save(update_fields=["quantity", "quantity_sold"])

                return CustomerOrderMutation(ok=True, status=200, message="Customer Order updated")
            except:
                return CustomerOrderMutation(ok=False, status=400, message="Customer Order unable to update")
        elif action == "delete":
            try:
                if order_id is not None:
                    customerOrder = CustomerOrder.objects.get(id=order_id, user=user)
                    customerOrder.delete()
                    for item in original_items:
                        category: Category = Category.objects.get(name=item.get("category").get("name"))
                        vendor: Vendor = Vendor.objects.get(
                            name=item.get("vendor").get("name"),
                            email=item.get("vendor").get("email"),
                        )
                        inventory:Inventory = Inventory.objects.get(
                            category=category,
                            vendor=vendor,
                            name=item.get("name"), 
                            brand=item.get("brand"),
                            user=user,
                        )

                        inventory.quantity += 1 
                        inventory.quantity_sold -= 1 if inventory.quantity_sold > 0 else 0
                        inventory.save(update_fields=["quantity", "quantity_sold"])
                else:
                    return CustomerOrderMutation(ok=False, status=400, message="Customer Order doesn't exist")
                
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
        user_token = graphene.String(required=True)

    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()

    def mutate(root, info, action, name, updated_name, user_token):
        try:
            email: get_user_model = jwt_decode(user_token).get("email")
            user: User = User.objects.filter(email=email).first()
        except:
            return {"ok": False, "message": "Unauthorized user", "status": 401}

        action = action.lower()

        if action == "add":
            category, created = Category.objects.get_or_create(name=name, user=user)
            if created:
                return CategoryMutation(ok=True, status=200, message="Category added")
            else:
                return CategoryMutation(ok=False, status=400, message="Category already exists")
        elif action == "update":
            try:
                category = Category.objects.get(name=name, user=user)
                category.name = updated_name if updated_name is not None else name
                category.save(update_fields=["name"])
                return CategoryMutation(ok=True, status=200, message="Category updated")
            except:
                return CategoryMutation(ok=False, status=400, message="Category doesn't exists")
        elif action == "delete":
            try:
                category = Category.objects.get(name=name, user=user)
                category.delete()
                return CategoryMutation(ok=True, status=200, message="Category deleted")
            except:
                return CategoryMutation(ok=False, status=400, message="Category doesn't exist")
        else:
            return CategoryMutation(ok=False, status=400, message="Invalid Action")

# Users
class CreateUserMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        is_owner = graphene.Boolean(required=True)
        is_employee = graphene.Boolean(required=True)
        store_name = graphene.String(required=True)

    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()
    token = graphene.String()

    def mutate(root, info, email, password, is_owner, is_employee, store_name):
        if (is_owner):
            user = get_user_model() (
                email=email,
                is_owner=is_owner,
                is_employee=is_employee,
                store_name=store_name,
            )
            user.set_password(password)
            user.save()
        elif (is_employee):
            user = get_user_model() (
                email=email,
                is_employee=is_employee,
                store_name=store_name,
            )
            user.set_password(password)
            user.save()
        return CreateUserMutation(ok=True, status="200", message="User created", token=jwt_encode(jwt_payload(user)))

class ClientLoginMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    ok = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()
    token = graphene.String()

    def mutate(root, info, email, password):
        user = authenticate(username=email, password=password)

        if user is None:
            return ClientLoginMutation(ok=False, status="404", message="Enter valid credentials", token=None)

        return ClientLoginMutation(ok=True, status="200", message="Logged in", token=jwt_encode(jwt_payload(user)))
        
    
class Mutations(graphene.ObjectType):
    product_mutation = ProductMutation.Field()
    vendor_mutation = VendorMutation.Field()
    vendor_order_mutation = VendorOrderMutation.Field()
    customer_mutation = CustomerMutation.Field()
    customer_order_mutation = CustomerOrderMutation.Field()
    category_mutation = CategoryMutation.Field()
    create_user = CreateUserMutation.Field()
    user_login = ClientLoginMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutations)