
# coding: utf-8

# In[1]:


from pymongo import MongoClient


# In[2]:


def get_conn():
    #client = MongoClient("mongodb://localhost:27017")
    client = MongoClient("mongodb://sprint-dev-db1:X3SgoZmQ0mVZHqaQWXCFWP6DWQ9oUTVxO7rioVLJQF6zEoRk5FEePdXk3795o3zRtWxdbiCAS9yZfzhlj0CuNQ==@sprint-dev-db1.documents.azure.com:10255/LorialTestDB?ssl=true")
    return client


# In[3]:


def get_db(client):
    db = client.LorialTestDB
    return db


# In[4]:


cl = get_conn()
db = get_db(cl)


# In[14]:


print(db.colorshades.count())


# In[10]:


# use below code only if you want to empty complete database

result = db.colorshades.delete_many({})
print(result.deleted_count)

# clean the users table
#result = db.userAuthorization.delete_many({})
#print(result.deleted_count)
