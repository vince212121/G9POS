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

# Queries
class Product(graphene.ObjectType):
    name = graphene.String()
    description = graphene.String()
    quantity = graphene.Int()
    quantity_sold = graphene.Int()
    price = graphene.Float()
    
class CustomerOrder(graphene.ObjectType):
    pass

class VendorOrder(graphene.ObjectType):
    pass

class Customer(graphene.ObjectType):
    pass

class Query(graphene.ObjectType):
    product = graphene.Field(Product)
    customer_order = graphene.Field(CustomerOrder)
    vendor_order = graphene.Field(CustomerOrder)
    customer = graphene.Field(Customer)


# schema
# TODO: Import graphene and models
# Then create the types for the models and the query, post, delete, etc.
# https://docs.graphene-python.org/projects/django/en/latest/

# Mutations
# Products/Inventory
class AddProduct(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        quantity = graphene.Int(required=True)
        quantity_sold = graphene.Int(required=True)
        price = graphene.Float(required=True)
    
    ok = graphene.Boolean()

    # Need to add authentication for queries (could use a resolver to check if the user is not anonymous)
    # https://docs.graphene-python.org/en/latest/types/objecttypes/#resolvers
    def mutate(root, info, name, description, quantity, quantity_sold, price):
        # TODO: need to save to db
        # product = Inventory(
        #     name=name,
        #     description=description,
        #     quantity=quantity,
        #     quantity_sold=quantity_sold,
        #     price=price,
        # )
        # product.save()
        ok = True
        return AddProduct(ok=ok)

class UpdateProduct(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

class DeleteProduct(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

# Previous Vendor Orders
# TODO: could add arguements for vendor orders or just make another mutation for it 
# Probably need to do the same thing with customer orders as they are similar
class AddVendorOrder(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

class UpdateVendorOrder(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

class DeleteVendorOrder(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

# Previous Customer Orders
class AddCustomerOrder(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

class UpdateCustomerOrder(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

class DeleteCustomerOrder(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

# Customer
class AddCustomer(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass
class UpdateCustomer(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

class DeleteCustomer(graphene.Mutation):
    class Arguments:
        pass

    def mutate(root, info):
        pass

# Users
# https://www.howtographql.com/graphql-python/4-authentication/

class Mutations(graphene.ObjectType):
    add_product = AddProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()
    add_customer_order = AddCustomerOrder.Field()
    update_customer_order = UpdateCustomerOrder.Field()
    delete_customer_order = DeleteCustomerOrder.Field()
    add_customer = AddCustomer.Field()
    update_customer = UpdateCustomer.Field()
    delete_customer = DeleteCustomer.Field()
    add_vendor_order = AddVendorOrder.Field()
    update_vendor_order = UpdateVendorOrder.Field()
    delete_vendor_order = DeleteVendorOrder.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)