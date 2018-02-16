
# coding: utf-8

# In[41]:

import pandas as pd
import numpy as np
from FileReader import read_file, read_file_and_validate
import DataAccess as da
from ColorSpaceConvert import convert_to_rgb_color
import datetime
from DataAccess import get_logcounter, create_log
import math

# In[55]:
client = da.get_conn() 
db = da.get_db(client)

def read_data(data, isDBExist = True, logid=None):
    data = pd.DataFrame(data)
    #data = data.fillna('')
    #print(convertedData)
    datadict = []
    datadict1 = []
    usecols = data[0:1]
    usedata = data[0:]
    dataCount = len(usedata)
    print("DATA COUNT => ", dataCount)
    sprID = da.get_counter(db, "userid")
    #print("usedata => ")
    #print(usedata.shape)
    #print(len(usedata))
    counter = 0;
    for index, rows in usedata.iterrows():
        #datadict1 = []
        #print rows[0], rows[1], rows[2], rows[3]
        timestamp = str(datetime.datetime.now()).split('.')[0]
        if(index == 0):
            sprID = sprID
        else:
            sprID = sprID + 1
        if(isDBExist):
            #print(rows)
            dd = {"Sprint_Id":sprID,"Name_of_Campaign":rows[0], "Date_Campaign": rows[1],
            "Group":rows[2], "Division":rows[3], 
            "Brand":rows[4], "Line":rows[5], "Type_of_Product":rows[6],
            "Product_Form":rows[7], "Formula_Number":rows[8], "Commercial_Shade_Name":rows[9],
            "Technical_Number":rows[10], "Commercial_Number":rows[11], "Level":rows[12],
            "Booster_Formula_Number":rows[13], "Alkaline_Agent":rows[14], "Quantity_49":rows[15],
            "Quantity_671":rows[16], "Developer_Strength":rows[17], "Developer_Formula_Number":rows[18],
            "Mixture":rows[19],"Processing_Time_min":rows[20], "Fiber_Code":rows[21],
            "Type_of_Fibre":rows[22], "Fiber":rows[23], "Percent_White":rows[24],
            "Fiber_Origin":rows[25], "L_Transposed":rows[26], "a_Transposed":rows[27],
            "b_Transposed":rows[28], "C_Transposed":rows[29], "H_Transposed":rows[30], 
	    "Added_On":timestamp, "rgb_Color":convert_to_rgb_color(float(rows[26]), float(rows[27]), float(rows[28])), "logid":logid,
	    "Reflect":rows[31], "Primary_Reflect":rows[32], "Secondary_Reflect":rows[33]}
        else:
            dd = {"Name_of_Campaign":rows[0], "Date_Campaign": rows[1],
            "Group":rows[2], "Division":rows[3], 
            "Brand":rows[4], "Line":rows[5], "Type_of_Product":rows[6],
            "Product_Form":rows[7], "Formula_Number":rows[8], "Commercial_Shade_Name":rows[9],
            "Technical_Number":rows[10], "Commercial_Number":rows[11], "Level":rows[12],
            "Booster_Formula_Number":rows[13], "Alkaline_Agent":rows[14], "Quantity_49":rows[15],
            "Quantity_671":rows[16], "Developer_Strength":rows[17], "Developer_Formula_Number":rows[18],
            "Mixture":rows[19],"Processing_Time_min":rows[20], "Fiber_Code":rows[21],
            "Type_of_Fibre":rows[22], "Fiber":rows[23], "Percent_White":rows[24],
            "Fiber_Origin":rows[25], "L_Transposed":rows[26], "a_Transposed":rows[27],
            "b_Transposed":rows[28], "C_Transposed":rows[29], "H_Transposed":rows[30],
	    "Reflect":rows[31], "Primary_Reflect":rows[32], "Secondary_Reflect":rows[33]}

        datadict1.append(dd)
        #data_push(datadict1)
        print("COUNT => ", index)
        #datadict.append(dd)
        #if(dataCount == index-1):
            #break
	#print("DATA DICT => ")
	#print(datadict)
        counter = counter + 1
        if(counter == 200 or dataCount == index + 1):
            datadict.append(datadict1)
            datadict1 = []
            counter = 0

    return datadict

#def is_NaN(data):
#    if np.isnan(data, casting='no'):
#        return ""
#    else:
#        return str(data)

def data_processing(filename, username):
    # validate all the data
    #error_collection = read_file_and_validate(filename)
    #if len(error_collection)>0:
    #    dta = read_data(error_collection, False, None)
    #    return [dta, 0]
    
  #if everythin alright, create a log id and append with the docs
    logid = get_logcounter(db)
    create_log(db, logid, username)

  # read all the data from uploaded data file
    csv = read_file(filename)   

    # read all the data from file reader object    
    rdata = read_data(csv, True, logid)
    #print("LENGTH => ")
    #print(len(rdata))
    # send read data to database pushing
    return [[],data_push(rdata)] #data_push(rdata)
    #return 1

def data_validation(csv):
    csv = pd.DataFrame(csv)    
    error_data = []    
    usedata = csv[1:]    

def data_push(data):
    #print("PUSH DATA => ")
    #print(data)
    #result = da.add_entries(db, data)
    _count = 0;
    for item in data:
        result = da.add_entries(db, item)
        _count = _count + 1
        print(_count)
    #result = "1"
    if len(result) > 0:
      return 1
    else:
      return 0

















#***************************************************************************
# In[56]:

#dd = [['Name_of_Campaign', 'Date_Campaign', 'Group', 'Division', 'Brand',
#       'Line', 'Type_of_Product'],
#       ['Beer - Blue Light', '8/30/2016', 'Bread Country Roll',
#        'Land Cruiser', 'Leexo', 'PT', 'Red'],
#       ['Split Peas - Yellow, Dry', '4/29/2017', 'Pie Shells 10', '240',
#        'Dabtype', 'CN', 'Goldenrod'],
#       ['Flour - Strong', '10/26/2016', 'Dikon', 'Mazdaspeed 3',
#        'Dabshots', 'UA', 'Blue'],
#       ['Pasta - Lasagne, Fresh', '5/20/2017', 'Veal - Inside, Choice',
#        'Savana 3500', 'Skivee', 'MN', 'Crimson'],
#       ['Beer - Mcauslan Apricot', '10/20/2016', 'Lettuce - Boston Bib',
#        'Skyhawk', 'Skyndu', 'HR', 'Fuscia'],
#       ['Wine - Jackson Triggs Okonagan', '1/17/2017', 'Bread - 10 Grain',
#        'Ram Van B250', 'Jaloo', 'AR', 'Puce'],
#       ['Syrup - Monin - Granny Smith', '11/7/2016', 'Pea - Snow',
#        'Cavalier', 'Trunyx', 'UG', 'Mauv'],
#       ['Mushroom - Crimini', '5/2/2017', 'Pomello', 'B-Series Plus',
#        'Geba', 'ID', 'Crimson'],
#       ['Sugar - Invert', '3/17/2017', 'Dehydrated Kelp Kombo', 'Tahoe',
#        'Tagcat', 'CN', 'Khaki']]
#dd = pd.DataFrame(dd)
#read_data(dd)

