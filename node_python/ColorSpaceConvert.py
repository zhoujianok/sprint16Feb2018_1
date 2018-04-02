
# coding: utf-8

# In[13]:


#from colormath.color_objects import LabColor, sRGBColor
#from colormath.color_conversions import convert_color
from skimage import color
from colour import Color

# In[26]:

def convert_to_rgb_color(L, a, b):
    #lab = LabColor(L, a, b)
    #rgb = convert_color(lab, sRGBColor)
    #hexcolor = rgb.get_rgb_hex()
    ##print(hexcolor)
    #return str(hexcolor)[1:]
    lab = [[[L, a, b]]]
    rgb_01 = color.lab2rgb(lab)
    L_01 = rgb_01[0,0,0]
    a_01 = rgb_01[0,0,1]
    b_01 = rgb_01[0,0,2]
    rgb = Color(rgb=(L_01,  a_01,  b_01))
    return rgb.hex[1:]