
# coding: utf-8

# In[4]:

import pandas as pd
import numpy as np
import csv

#error_collection = []

# In[ ]:

def read_file(filename):
    colnames = ['Name_of_Campaign', 'Date_Campaign', 'Group', 'Division', 'Brand',
            'Line', 'Type_of_Product']
    #print(filename)
    csv = pd.read_csv(filename, delimiter=',')
    data = np.array(csv)
    #print data
    return data


# In[20]:
def read_file_and_validate(filename):
    error_collection = []
    f = open(filename, "r")
    reader = csv.reader(f)
    next(reader, None)
    #print(type(reader))
    for row in reader:
        #print(type(row))
        # validate group
        if(not isinstance(row[2], str) or row[2] == ""):
            #print_errored_row(row)
            error_collection.append(row)
            continue
        else:
            # validate Developer_Strength
            if(not isinstance(row[17], str) or row[17] == ""):
                #print_errored_row(row)
                error_collection.append(row)
                continue
            else:
                # validate Mixture
                if(not isinstance(row[19], str) or row[19] == ""):
                    #print_errored_row(row)
                    error_collection.append(row)
                    continue
                else:
                    # validate Processing_Time_min
                    if(not isinstance(row[20], str) or row[20] == ""):
                        #print_errored_row(row)
                        error_collection.append(row)
                        continue
                    else:
                        # validate Type_of_Fibre
                        if(not isinstance(row[22], str) or row[22] == ""):
                            #print_errored_row(row)
                            error_collection.append(row)
                            continue
                        else:
                            # validate Fiber
                            if(not isinstance(row[23], str) or row[23] == ""):
                                #print_errored_row(row)
                                error_collection.append(row)
                                continue
                            else:
                                # validate Percent_White
                                if(not isinstance(row[24], str) or row[24] == ""):
                                    #print_errored_row(row)
                                    error_collection.append(row)
                                    continue
                                else:
                                    # validate Fiber_Origin
                                    if(not isinstance(row[25], str) or row[25] == ""):
                                        #print_errored_row(row)
                                        error_collection.append(row)
                                        continue
                                    else:
                                        # validate L_Transposed
                                        if(not is_number(row[26]) or row[26] == ""):
                                            #print_errored_row(row)
                                            error_collection.append(row)
                                            continue
                                        else:
                                            # validate a_Transposed
                                            if(not is_number(row[27]) or row[27] == ""):
                                                #print_errored_row(row)
                                                error_collection.append(row)
                                                continue
                                            else:
                                                # validate b_Transposed
                                                if(not is_number(row[28]) or row[28] == ""):
                                                    #print_errored_row(row)
                                                    error_collection.append(row)
                                                    continue
                                                else:
                                                    # validate C_Transposed
                                                    if(not is_number(row[29]) or row[29] == ""):
                                                        #print_errored_row(row)
                                                        error_collection.append(row)
                                                        continue
                                                    else:
                                                        # validate H_Transposed
                                                        if(not is_number(row[30]) or row[30] == ""):
                                                            #print_errored_row(row)
                                                            error_collection.append(row)
                                                            continue
                                                        
    print("Data OK")
    print("Errored Records Count: ",len(error_collection))
    #print(error_collection)
    f.close()
    return error_collection

# In[23]:
def is_number(s):
    """ Returns True is string is a number. """
    try:
        float(s)
        return True
    except ValueError:
        return False

def print_errored_row(row):
    #print(row)
    error_collection.append(row)

## Testing

##def read_format_data(data):
##    data = pd.DataFrame(data)
##    datadict = []
##    usecols = data[0:1]
##    usedata = data[1:]
##    for index, rows in usedata.iterrows():
##        #print rows[0], rows[1], rows[2], rows[3]
##
##        dd = {"Name_of_Campaign":rows[0], "Date_Campaign": rows[1],
##        "Group":rows[2], "Division":rows[3], 
##        "Brand":rows[4], "Line":rows[5], "Type_of_Product":rows[6],
##        "Product_Form":rows[7], "Formula_Number":rows[8], "Commercial_Shade_Name":rows[9],
##        "Technical_Number":rows[10], "Commercial_Number":rows[11], "Level":rows[12],
##        "Booster_Formula_Number":rows[13], "Alkaline_Agent":rows[14], "Quantity_49":rows[15],
##        "Quantity_671":rows[16], "Developer_Strength":rows[17], "Developer_Formula_Number":rows[18],
##        "Mixture":rows[19],"Processing_Time_min":rows[20], "Fiber_Code":rows[21],
##        "Type_of_Fibre":rows[22], "Fiber":rows[23], "Percent_White":rows[24],
##        "Fiber_Origin":rows[25], "L_Transposed":rows[26], "a_Transposed":rows[27],
##        "b_Transposed":rows[28], "C_Transposed":rows[29], "H_Transposed":rows[30]}
##        datadict.append(dd)
##        
##    return datadict
##
##def Test():
##    col = read_file_and_validate("uploads/SPRINT Database.csv")
##    dta = read_format_data(col)
##    if len(col) > 0:
##        return [dta, 0]
##    return [[], 1]
##
##print(Test())

