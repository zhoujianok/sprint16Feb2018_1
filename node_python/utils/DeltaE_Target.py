
# coding: utf-8

# In[1]:


import numpy as np


# In[2]:
def calculate_DE_Target(data, L, a, b):
    LabArr = np.array([L, a, b])
    #print(data)
    # In[4]:
    LabData = data
    ##LabDataArr = np.array(LabData)
    ##LabDataArr

    # In[5]:
    for index in range(len(LabData)):
        #print(LabData[index])
        for i in range(len(LabData[index])):
            #print(LabData[index][i])
            resL = LabArr[0] - LabData[index]['L_Transposed']
            resa = LabArr[1] - LabData[index]['a_Transposed']
            resb = LabArr[2] - LabData[index]['b_Transposed']
            deltaE_target = (resL**2) + (resa**2) + (resb**2)
            LabData[index]['deltaE_target'] = np.sqrt(deltaE_target)
##            print(np.sqrt(deltaE_target))
            
    return LabData

