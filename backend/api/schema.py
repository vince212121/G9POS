import graphene

class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")

schema = graphene.Schema(query=Query)

# schema
# TODO: Import graphene and models
# Then create the types for the models and the query, post, delete, etc.
# https://docs.graphene-python.org/projects/django/en/latest/
