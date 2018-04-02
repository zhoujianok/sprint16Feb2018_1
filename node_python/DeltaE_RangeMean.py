import pandas as pd
import time
import numpy as np
import ast
import json
from colormath.color_objects import LabColor
from colormath.color_diff import delta_e_cie1976


def calculate_DE_RangeMean(data, L_min, L_max, a_min, a_max, b_min, b_max):
    data = pd.DataFrame(data)
    #df = pd.read_json(data,orient='records')
    L = np.arange(L_min, L_max) 
    a = np.arange(a_min, a_max) 
    b = np.arange(b_min, b_max) 
    
   
    L_mean = np.ceil(np.mean(L))
    a_mean = np.ceil(np.mean(a))
    b_mean = np.ceil(np.mean(b))

    LabArr = np.array([L_mean, a_mean, b_mean])

    df = data

##    df['LT'] = L_mean - df['L_Transposed']
##    df['aT'] = a_mean - df['a_Transposed']
##    df['bT'] = b_mean - df['b_Transposed']
##    data['deltaE_mean'] = np.sqrt((df['LT']**2) + (df['aT']**2) + (df['bT']**2))

##    df['LT'] = L_mean - df['L_Transposed']
##    df['aT'] = a_mean - df['a_Transposed']
##    df['bT'] = b_mean - df['b_Transposed']
    df['Lab_Color'] = df.apply(get_lab_colors, axis=1)
    df['Lab_ref'] = LabColor(lab_l=L_mean, lab_a=a_mean, lab_b=b_mean)
    data['deltaE_mean'] = df.apply(cal_deltae, axis=1)

    
    data['a_delta_mean'] = a_mean
    data['b_delta_mean'] = b_mean

    data['L_delta_mean'] = L_mean
    data['c_delta_mean'] = np.sqrt(np.square(a_mean)+ np.square(b_mean))

    if (a_mean != 0 and b_mean != 0):
        H_mean = 180 / np.pi * (np.arctan(b_mean / a_mean))
        C_mean = np.sqrt(np.square(a_mean) + np.square(b_mean))
        data["C_mean"] = C_mean
        data["H_mean"] = H_mean
    else:
        H_mean = 0,
        C_mean = np.sqrt(np.square(a_mean) + np.square(b_mean))
        data["C_mean"] = pd.Series(H_mean)
        data["H_mean"] = C_mean

    #print("Mean => ", len(data))
    data = data.to_json(orient='records')
    return data

def get_lab_colors(row):
    return LabColor(lab_l=row['L_Transposed'], lab_a=row['a_Transposed'], lab_b=row['b_Transposed'])


def cal_deltae(row):
    return delta_e_cie1976(row['Lab_ref'], row['Lab_Color'])


def get_ab_mean(a_mean, b_mean):    
    return {"a_delta_mean":a_mean, "b_delta_mean":b_mean}

def get_lc_mean(L_mean, a_mean, b_mean):
    c_value = np.sqrt(np.square(a_mean)+ np.square(b_mean))
    return {"L_delta_mean":L_mean, "c_delta_mean":c_value}

def get_CH_mean(a_mean, b_mean):
    if (a_mean != 0 and b_mean != 0):
        H_mean = 180 / np.pi * (np.arctan(b_mean / a_mean))
        C_mean = np.sqrt(np.square(a_mean) + np.square(b_mean))
        return {"C_mean":C_mean, "H_mean":H_mean}
    else:
        H_mean = 0,
        C_mean = np.sqrt(np.square(a_mean) + np.square(b_mean))
        return {"C_mean":H_mean, "H_mean":C_mean}
