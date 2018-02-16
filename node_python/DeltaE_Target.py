import time
import json
import pandas as pd
#from DeltaE_Target import  calculate_DE_Target
#from numba import jit
import numpy as np
from colormath.color_objects import LabColor
from colormath.color_diff import delta_e_cie1976

def calculate_DE_Target(data, L, a, b):
    df = pd.read_json(data, orient="records")
    data = df
##    df['LT'] = L - df['L_Transposed']
##    df['aT'] = a - df['a_Transposed']
##    df['bT'] = b - df['b_Transposed']
##    data['deltaE_target'] = np.sqrt((df['LT']**2) + (df['aT']**2) + (df['bT']**2))
    df['Lab_Color'] = df.apply(get_targetlab_colors, axis=1)
    df['Lab_ref'] = LabColor(lab_l=L, lab_a=a, lab_b=b)
    data['deltaE_target'] = df.apply(cal_deltae_target, axis=1)
    data['a_delta_target'] = a
    data['b_delta_target'] = b
    data["L_delta_target"] = L
    data['c_delta_target'] = np.sqrt(np.square(a)+ np.square(b))
    data['H_target'] = 180 / np.pi * (np.arctan(b / a))
    data['C_target'] = np.sqrt(np.square(a) + np.square(b))
    #print("TARGET => ", len(data))
    data = data.to_json(orient='records')

    return data

def get_targetlab_colors(row):
    return LabColor(lab_l=row['L_Transposed'], lab_a=row['a_Transposed'], lab_b=row['b_Transposed'])


def cal_deltae_target(row):
    return delta_e_cie1976(row['Lab_ref'], row['Lab_Color'])



def get_ab_target(a, b):    
    return {"a_delta_target":a, "b_delta_target":b}

def get_lc_target(L, a, b):
    c_value = np.sqrt(np.square(a)+ np.square(b))
    return {"L_delta_target":L, "c_delta_target":c_value}

def get_CH_target(a, b):
    H_target = 180 / np.pi * (np.arctan(b / a))
    C_target = np.sqrt(np.square(a) + np.square(b))
    return {"C_target":C_target, "H_target":H_target}
