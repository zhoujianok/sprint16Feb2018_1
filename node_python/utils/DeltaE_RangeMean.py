
# coding: utf-8

# In[1]:


import numpy as np
import ast

# In[2]:
def calculate_DE_RangeMean(data, L_min, L_max, a_min, a_max, b_min, b_max):
    L = range(L_min, L_max)
    a = range(a_min, a_max)
    b = range(b_min, b_max)
    #print(data)
    # In[3]:
    L_mean = np.ceil(np.mean(L))
    a_mean = np.ceil(np.mean(a))
    b_mean = np.ceil(np.mean(b))

    # In[4]:
    LabArr = np.array([L_mean, a_mean, b_mean])
    #LabArr

    # In[5]:
    LabData = data #[{'L':60.52, 'a':25.53, 'b':25.61},{'L':59.12, 'a':42.08, 'b':43.33}]
    #LabDataArr = np.array(LabData)
    #LabDataArr

    # In[6]:
    for index in range(len(LabData)):
        #print(LabData[index])
        for i in range(len(LabData[index])):
            #print(LabData[index][i])
            resL = LabArr[0] - LabData[index]['L_Transposed']
            resa = LabArr[1] - LabData[index]['a_Transposed']
            resb = LabArr[2] - LabData[index]['b_Transposed']
            deltaE_mean = (resL**2) + (resa**2) + (resb**2)
            LabData[index]['deltaE_mean'] = np.sqrt(deltaE_mean)
            #print(LabData[index])


    return LabData


# In[ ]:


# below code is for json iteration
#st = "[{'L':60.52, 'a':25.53, 'b':25.61},{'L':59.12, 'a':42.08, 'b':43.33}]"
#dt = ast.literal_eval(st)
#print(type(dt))
#print(type(st))


# In[ ]:


# adding property with value to the existing json
#for i in range(len(dt)):
    #print(dt[i])
#    calculate_DE_RangeMean(dt[i], 55, 75, 25, 45, 25, 45)
#print(dt)

