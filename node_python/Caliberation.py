from flask import Flask, jsonify, request, redirect, url_for, render_template
import os
import json
from werkzeug import secure_filename, datastructures
#from flasgger import Swagger
import numpy as np
import pandas as pd
from DataHandler import data_processing
import DataAccess as da
from __init__ import app
import DeltaE_RangeMean as DE
import DeltaE_Target as DET
#import classification as cls
from classification import clustering, nearest, getLabDict
import ast

#/api/data/add
@app.route("/api/calculate/deltavalues", methods=['POST']) 
def add_data_entry():
    """
	This is the Trial Entry API
	---
	tags:
	  - The Add Database Entry API
	parameters:
	  - name : doc
	    in : query
	    type : string
	    required : true
	    description : doc
    """
    # read all the values in a request
    jsondata = request.get_json()	
    data = jsondata['data'] #request.args.get
    filter = jsondata['filter']
    L_min = float(filter['L_min'])
    L_max = float(filter['L_max'])
    a_min = float(filter['a_min'])
    a_max = float(filter['a_max'])
    b_min = float(filter['b_min'])
    b_max = float(filter['b_max'])
    L = float(filter['L'])
    a = float(filter['a'])
    b = float(filter['b'])
   
    dt = ast.literal_eval(data)
    #print(type(dt))
    if len(dt) != 0:
    
        #with open('initial_data.txt', 'w') as outfile:
            #json.dump(dt, outfile)

        retData = DE.calculate_DE_RangeMean(dt, L_min, L_max, a_min, a_max, b_min, b_max)

        #with open('range_mean_data.txt', 'w') as outfile:
            #json.dump(retData, outfile)
        
        retdata = DET.calculate_DE_Target(retData, L, a, b)

        #with open('target_data.txt', 'w') as outfile:
            #json.dump(retdata, outfile)
        
        # return result
        return jsonify({"data":retdata})
    return jsonify({"data":list()})


# api is used to calculate the nearest formula to the target
@app.route("/api/calculate/nearest_formula", methods=['POST']) 
def nearest_():	
	jsondata = request.get_json()	
	data = jsondata["data"]
	pt = getLabDict(float(jsondata['L']),float(jsondata['a']),float(jsondata['b'])) #cal_mean(int(jsondata['L_min']),int(jsondata['L_max']),int(jsondata['a_min']),int(jsondata['a_max']),int(jsondata['b_min']),int(jsondata['b_max']))
	n=int(jsondata['n'])
	#print(pt)
	#result = nearest(data,pt);
	#print(float(jsondata['L']),float(jsondata['a']),float(jsondata['b']))    
	return jsonify({"nearest":nearest(data,pt,n)})



# api is used to calculate the clusters of provided data
@app.route("/api/calculate/clusters", methods=['POST']) 
def classification_():
    jsondata =  request.get_json()
    data = jsondata['data'] #[0]
    n=int(jsondata['n'])
    return jsonify({"data":clustering(data, n)}) #clustering(data)
