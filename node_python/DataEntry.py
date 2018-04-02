from flask import Flask, request, jsonify
import DataAccess as da
from __init__ import app

#app = Flask(__name__)
#Swagger(app)

client = da.get_conn()
db = da.get_db(client)

@app.route("/api/data/add", methods=['POST'])
def add_data_entry():
	"""
	This is the Add Database Entry API
	---
	tags:
	  - The Add Database Entry API
	parameters:
	  - name : Name_of_Campaign
	    in : query
	    type : string
	    required : true
	    description : Name_of_Campaign

	  - name : Date_Campaign
	    in : query
	    type : date
	    required : true
	    description : Date_Campaign

	  - name : Group
	    in : query
	    type : string
	    required : true
	    description : Group 

 	  - name : Division
	    in : query
	    type : string
	    required : true
	    description : Division

	  - name : Line
	    in : query
	    type : string
	    required : true
	    description : Line

	  - name : Type_of_Product
	    in : query
	    type : string
	    required : true
	    description : Type_of_Product

	  - name : Product_Form
	    in : query
	    type : string
	    required : true
	    description : Product_Form

	  - name : Formula_Number
	    in : query
	    type : int
	    required : true
	    description : Formula_Number

	  - name : Commercial_Shade_Name
	    in : query
	    type : string
	    required : true
	    description : Commercial_Shade_Name

	  - name : Technical_Number
	    in : query
	    type : float
	    required : false
	    description : Technical_Number

	  - name : Commercial_Number
	    in : query
	    type : int
	    required : true
	    description : Commercial_Number

	  - name : Level
	    in : query
	    type : int
	    required : true
	    description : Level

	  - name : Booster_Formula_Number
	    in : query
	    type : int
	    required : true
	    description : Booster_Formula_Number
	   
	  - name : Quantity_49
	    in : query
	    type : float
	    required : false
	    description : Quantity_49

	  - name : Quantity_671
	    in : query
	    type : float
	    required : false
	    description : Quantity_671  	    

	  - name : Mixture
	    in : query
	    type : string
	    required : true
	    description : Mixture

	  - name : Processing_Time_min
	    in : query
	    type : string
	    required : true
	    description : Processing_Time_min

	  - name : Fiber_Code
	    in : query
	    type : string
	    required : true
	    description : Fiber_Code

	  - name : Type_of_Fibre
	    in : query
	    type : string
	    required : true
	    description : Type_of_Fibre

	  - name : Fiber
	    in : query
	    type : string
	    required : true
	    description : Fiber

	  - name : Percent_White
	    in : query
	    type : int
	    required : true
	    description : Percent_White

	  - name : Fiber_Origin
	    in : query
	    type : string
	    required : true
	    description : Fiber_Origin

	  - name : L_Transposed
	    in : query
	    type : float
	    required : true
	    description : L_Transposed

	  - name : a_Transposed
	    in : query
	    type : float
	    required : true
	    description : a_Transposed

	  - name : b_Transposed
	    in : query
	    type : string
	    required : true
	    description : b_Transposed

	  - name : C_Transposed
	    in : query
	    type : float
	    required : true
	    description : C_Transposed

	  - name : H_Transposed
	    in : query
	    type : float
	    required : true
	    description : H_Transposed

    	"""
	Name_of_Campaign = request.args.get('Name_of_Campaign')
    	Date_Campaign = request.args.get('Date_Campaign')
    	Group = request.args.get('Group')
    	Division = request.args.get('Division')
    	Line = request.args.get('Line')
    	Type_of_Product = request.args.get('Type_of_Product')
    	Product_Form = request.args.get('Product_Form')
    	Formula_Number = request.args.get('Formula_Number')
    	Commercial_Shade_Name = request.args.get('Commercial_Shade_Name')
    	Technical_Number = request.args.get('Technical_Number')
    	Commercial_Number = request.args.get('Commercial_Number')
    	Level = int(request.args.get('Level'))
    	Booster_Formula_Number = request.args.get('Booster_Formula_Number')
    	Alkaline_Agent = request.args.get('Alkaline_Agent')
    	Quantity_49 = float(request.args.get('Quantity_49'))
    	Quantity_671 = float(request.args.get('Quantity_671'))
    	Developer_Strength = request.args.get('Developer_Strength') 
    	Developer_Formula_Number = request.args.get('Developer_Formula_Number')
    	Mixture = request.args.get('Mixture')
    	Processing_Time_min = request.args.get('Processing_Time_min')
    	Fiber_Code = request.args.get('Fiber_Code')
    	Type_of_Fibre = request.args.get('Type_of_Fibre')
    	Fiber = request.args.get('Fiber')
    	Percent_White = request.args.get('Percent_White')
    	Fiber_Origin = request.args.get('Fiber_Origin')
    	L_Transposed = float(request.args.get('L_Transposed'))
    	a_Transposed = float(request.args.get('a_Transposed'))
    	b_Transposed = float(request.args.get('b_Transposed'))
    	C_Transposed = float(request.args.get('C_Transposed'))
    	H_Transposed = float(request.args.get('H_Transposed'))
		Reflect = request.args.get('Reflect')
		Primary_Reflect = request.args.get('Primary_Reflect')
		Secondary_Reflect = request.args.get('Secondary_Reflect')
    
# create a serialized object to be inserted into db
    	obj = { "Name_of_Campaign": Name_of_Campaign,
       "Date_Campaign": Date_Campaign,
       "Group" : Group,
       "Division" : Division,
       "Line" : Line,
       "Type_of_Product" : Type_of_Product,
       "Product_Form" : Product_Form,
       "Formula_Number" : Formula_Number,
       "Commercial_Shade_Name" : Commercial_Shade_Name,
       "Technical_Number" : Technical_Number,
       "Commercial_Number" : Commercial_Number,
       "Level" : Level,
       "Booster_Formula_Number" : Booster_Formula_Number,
       "Alkaline_Agent" : Alkaline_Agent,
       "Quantity_49" : Quantity_49,
       "Quantity_671" : Quantity_671,
       "Developer_Strength" : Developer_Strength,
       "Developer_Formula_Number" : Developer_Formula_Number,
       "Mixture" : Mixture,
       "Processing_Time_min" : Processing_Time_min,
       "Fiber_Code" : Fiber_Code,
       "Type_of_Fibre" : Type_of_Fibre,
       "Fiber" : Fiber,
       "Percent_White" : Percent_White,
       "Fiber_Origin" : Fiber_Origin,
       "L_Transposed" : L_Transposed,
       "a_Transposed" : a_Transposed,
       "b_Transposed" : b_Transposed,
       "C_Transposed" : C_Transposed,
       "H_Transposed" : H_Transposed,
	   "Reflect" : Reflect,
       "Primary_Reflect" : Primary_Reflect,
       "Secondary_Reflect" : Secondary_Reflect 
       }

    	_id = da.add_entry(db, obj)
    	return jsonify({"_id": str(_id)}) #str(_id)
