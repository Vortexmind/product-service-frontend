from locust import HttpLocust, TaskSet, task
from random import choice
from random import randint

def getSession():
    usersessions  = ['Bob', 'Kate', 'Joseph', 'Donald', 'Thomas', 'Drogo', 'Mia' , 'Judith', 'Karen' , 'Mauro']
    return choice(usersessions)

def getPrice():
    prices = [100, 200, 350, 500, 750, 1000, 1500, 2000]
    return choice(prices)

@task(1)
def goHome(s):
    s.client.get("/?session=%s" % getSession())

class BrowseProducts(TaskSet):
    @task(1)
    def loadAllProducts(s):
        s.client.get("/products?session=%s" % getSession())

    @task(2)
    def viewProduct(s):
        productId = randint(1, 10)
        s.client.get("/products/view/%i/?session=%s" % (productId, getSession() ))

class BuyProducts(TaskSet):
    @task(1)
    def loadAllProducts(s):
        s.client.get("/products?session=%s" % getSession())

    @task(1)
    def viewProduct(s):
        productId = randint(1, 10)
        s.client.get("/products/view/%i/?session=%s" % (productId, getSession()) )

    @task(3)
    def buyProduct(s):
        productId = randint(1, 10)
        s.client.get("/products/buy/%i/?price=%i&session=%s" % (productId, getPrice(),getSession()))

class UserBehavior(TaskSet):
    tasks = {goHome: 1, BrowseProducts:1, BuyProducts:2 }

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 2000
    max_wait = 4000
