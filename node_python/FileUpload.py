
from flask import Flask, jsonify, request, redirect, url_for, render_template
import os
from werkzeug import secure_filename, datastructures
#from flasgger import Swagger
import numpy as np
import pandas as pd
from DataHandler import data_processing
import DataAccess as da
from DataAccess import get_logs, delete_logs, resetLogCounter
from __init__ import app

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

FL_IMG_UPLOAD_FOLDER = '/uploads/FrontLeft/' #'\uploads\FrontLeft\\'
FR_IMG_UPLOAD_FOLDER = '/uploads/FrontRight/'
RL_IMG_UPLOAD_FOLDER = '/uploads/RearLeft/'
RR_IMG_UPLOAD_FOLDER = '/uploads/RearRight/'

#app = Flask(__name__)
#Swagger(app)
app.config['UPLOAD_FOLDER'] = ROOT_DIR + '/uploads/'

result_status = ["FAILED", "SUCCESS"]

client = da.get_conn() 
db = da.get_db(client)

@app.route('/')
def hello_world():
    """
        This is sample api returns Hello World 

        tags:
      -   - hello_world
    """
    #db.colorshades.delete_many({})    
    result = da.get_entries(db,{"_id": "598d66ce1d41c80d30499233"})    
    #print(result)
    return jsonify({"a":'Hello, World!', "b":result })

@app.route('/api/Upload', methods=['POST'])
def post_upload_file():
    """
    This is the Database Upload API
    Call this api passing file and get back its predicted values with damage position
    ---
    tags:
      - Database Upload API
    parameters:
      - name: file
        in: formData
        type: file
        required: false
        description: The File to be uploaded      
    responses:
      500:
        description: Error 
      200:
        description: Anayzed Image Predicted values
        schema:
          id: analysisResponse
          properties:
            filename:
              type: string
              description: the name of uploaded file
              default: ""
            db_push_status:
              type: string
              description: uploaded file status              
              default: "SUCCESS"

    """
    if request.method == 'POST':
       uploaded_files = request.files.getlist("file")
       username = request.form.get("username")
       upath = ROOT_DIR
       #print upath
       for img in uploaded_files:
           upath = app.config['UPLOAD_FOLDER']+img.filename
           img.save(upath)

    # send file for data processing
    result = data_processing(app.config['UPLOAD_FOLDER']+img.filename, username)
    print("FILE UPLOAD RESULT :=> ")
    print(result)
    return jsonify({"filename":img.filename, "db_push_status":result_status[result[1]], "error_data":result[0] }) #result_status[result]


@app.route('/api/Logs', methods=['GET'])
def upload_file_log():
    name = request.args.get('userid')
    #print(name)
    #print("userID : ", name)
    return jsonify({"log": get_logs(db, name)  })

@app.route('/api/deleteLogs', methods=['GET'])
def delete_file_log():
    logid = request.args.get('logid')
    #print(logid)
    #print("userID : ", ) 
    #delete_logs(db, logid)
    return jsonify({"log": delete_logs(db, logid) })

@app.route('/api/resetLogs', methods=['GET'])
def resetlogCounter():
    return jsonify({"result": resetLogCounter(db)})
