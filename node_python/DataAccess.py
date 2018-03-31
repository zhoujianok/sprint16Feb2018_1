
# coding: utf-8

# In[1]:

from pymongo import MongoClient
import datetime

# In[2]:

def get_conn():
    #client = MongoClient("mongodb://localhost:27017")
    client = MongoClient("mongodb://sprint-dev-db1:pjq8oZE5XpIIyefImM68esrWC7v2efkGgPxnRyo2LMhD0YrCIAVcWno2EBZXFLo1qTC8Orc0ND2doXZHU9VLEQ==@sprint-dev-db1.documents.azure.com:10255/LorialTestDB?ssl=true&replicaSet=globaldb")
    return client


# In[3]:

def get_db(client):
    db = client.LorialTestDB
    return db


# In[4]:

def add_entry(db, data):
    result = db.colorshades.insert_one(data) #.update(data,data,upsert=True) #insert_one(data)
    return result.inserted_id #nInserted #inserted_id


def add_entries(db, data):
    #print(data)
    result = db.colorshades.insert_many(data)
    return result.inserted_ids


# In[5]:

def get_entry(db, data):
    result = db.colorshades.find_one(data)
    return result#convert_data(result)
    
def get_entries(db, data):
  shades = []
  for shade in db.colorshades.find(data):      
      shades.append(convert_data(shade))
  return shades



def convert_data(data):
  #keys = ["Name_of_Campaign", "Date_Campaign","Group", "Division", 
  #      "Brand", "Line", "Type_of_Product", "Product_Form", "Formula_Number",
  #      "Commercial_Shade_Name", "Technical_Number", "Commercial_Number", 
  #      "Level","Booster_Formula_Number", "Alkaline_Agent", "Quantity_49",
  #      "Quantity_671", "Developer_Strength", "Developer_Formula_Number",
  #      "Mixture","Processing_Time_min", "Fiber_Code","Type_of_Fibre", 
  #      "Fiber", "Percent_White","Fiber_Origin", "_id"]
  keys = ["_id"]
  for i in range(len(keys)):
      data[keys[i]] = str(data[keys[i]])

  return data

##clllt = get_conn() 
##ddbbb = get_db(clllt)
def get_counter(db, name):
    ret = db.counters.update({'_id': str(name)}, {'$inc': {'seq': 1}})
    result = db.counters.find_one({'_id': str(name)})
    print("GET COUNTER => ", result['seq'])
    return result['seq']
##print(get_counter(ddbbb, "userid"))

def get_highestSprintId(db):
    count = db.colorshades.count()
    if(count > 0):
       return db.colorshades.find_one(sort=[("Sprint_Id", -1)])["Sprint_Id"]
    else:
        return 0
    #print("max_sprID", max_sprID)
    #return 0
# get and increament the log id counter
def get_logcounter(db, name = "logid"):
    ret = db.logcounters.update({'_id': str(name)}, {'$inc': {'seq': 1}})
    result = db.logcounters.find_one({'_id': str(name)})
    #print("REQUEST => ")
    #print(result['seq'])
    return result['seq']

def create_log(db, logid, userid):
    timestamp = str(datetime.datetime.now())
    result = db.file_upload_log.insert_one({ 'logid':logid, 'date':timestamp, 'userid':userid }) 
    #print(result)
    return result.inserted_id

def get_logs(db, name):
    #result = db.file_upload_log.find({'userid':name}); 
    logs = []
    for log in db.file_upload_log.find({'userid':name}):      
      logs.append(convert_data(log))    
    #print(logs)
    return logs

def delete_logs(db, logid):
    result = db.file_upload_log.delete_one({'logid': int(logid)})
    #print(result.deleted_count)
    return result

def resetLogCounter(db):
    #db.logcounters.update({'_id': str('logid')}, {'seq': 1})
    db.file_upload_log.delete_many({})






















#*************************************************************************************************
# In[24]:

#trialdatadict = []
#trialcols = ['Name_of_Campaign', 'Date_Campaign', 'Group', 'Division', 'Brand', 'Line'
#  ,'Type_of_Product']
#trialdata = [['Beer - Blue Light', '8/30/2016', 'Bread Country Roll', 'Land Cruiser',
#  'Leexo' ,'PT' ,'Red'],
# ['Split Peas - Yellow, Dry' ,'4/29/2017' ,'Pie Shells 10' ,'240' ,'Dabtype',
#  'CN', 'Goldenrod'],
# ['Flour - Strong' ,'10/26/2016' ,'Dikon' ,'Mazdaspeed 3', 'Dabshots', 'UA',
#  'Blue'],
# ['Pasta - Lasagne, Fresh', '5/20/2017' ,'Veal - Inside, Choice',
#  'Savana 3500', 'Skivee', 'MN' ,'Crimson'],
# ['Beer - Mcauslan Apricot', '10/20/2016', 'Lettuce - Boston Bib', 'Skyhawk',
#  'Skyndu', 'HR' ,'Fuscia'],
# ['Wine - Jackson Triggs Okonagan', '1/17/2017' ,'Bread - 10 Grain',
#  'Ram Van B250', 'Jaloo', 'AR', 'Puce'],
# ['Syrup - Monin - Granny Smith', '11/7/2016', 'Pea - Snow', 'Cavalier',
#  'Trunyx', 'UG', 'Mauv'],
# ['Mushroom - Crimini', '5/2/2017' ,'Pomello', 'B-Series Plus', 'Geba', 'ID',
#  'Crimson']]

#for i in range(len(trialdata)): 
    #print trialdata[i][0]
#    dd = {"Name_of_Campaign":trialdata[i][0], "Date_Campaign": trialdata[i][1],
#        "Group":trialdata[i][2], "Division":trialdata[i][3], 
#        "Brand":trialdata[i][4], "Line":trialdata[i][5], "Type_of_Product":trialdata[i][6]}
#    add_entry(db, dd)
#    trialdatadict.append(dd)
    
#print trialdatadict


# In[26]:

#data = {"Type_of_Product":"Fuscia"}
#get_entry(db, data)
