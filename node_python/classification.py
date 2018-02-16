import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.cluster import MiniBatchKMeans
from scipy.spatial import distance
import json,ast
from scipy import spatial
import ast

def clustering(data,n=7):
        data_df = pd.read_json(data)
        df = data_df.dropna(axis=0,how='all')
        df = df.filter(items=['L_Transposed', 'a_Transposed','b_Transposed'])
        df_matrix = df.as_matrix()
        pca = PCA(n_components=2)
        pca.fit(df_matrix)
        X = pca.transform(df_matrix)
        mbk = MiniBatchKMeans(init='k-means++', n_clusters=n,n_init=25,max_iter=100).fit(X)
        labels = mbk.labels_
        features = pd.DataFrame({'x':X[:,0],'y':X[:,1]})
        labels = pd.DataFrame({'label':labels})
        features.eval("label = @labels.values", inplace=True)
        data_output = pd.DataFrame(features)
        df_combine = df.join(data_output)
        jsondata = df_combine.to_dict(orient="records")
        return jsondata

def nearest(data,input_vector,n=8):
    with open('nearestInitial_data.txt', 'w') as outfile:
        json.dump(data, outfile)
    #data_numeric1 = pd.DataFrame(ast.literal_eval(data))
    data_numeric1 = pd.read_json(data)
    iv = input_vector
    data_numeric = data_numeric1.filter(items=['L_Transposed', 'a_Transposed','b_Transposed'])
    input_vector = [iv['L'],iv['a'], iv['b']]
    data_numeric = pd.DataFrame(data_numeric)
    euclidean_distances = data_numeric.apply(lambda row: distance.euclidean(row,input_vector),axis = 1)
    distance_frame = pd.DataFrame(data = {"dist":euclidean_distances, "idx":euclidean_distances.index})
    distance_frame.sort_values("dist", inplace=True)
    similar_prds  = distance_frame.iloc[0:n]["idx"] 
    return  data_numeric1.loc[similar_prds].to_json(orient="records") #to_json(orient="records")


def cal_mean(L_min,L_max,a_min,a_max,b_min,b_max):
    
    L = np.arange(L_min, L_max) #range(L_min, L_max)
    a = np.arange(a_min, a_max) #range(a_min, a_max)
    b = np.arange(b_min, b_max) #range(b_min, b_max)
    
    
    L_mean = np.ceil(np.mean(L))
    a_mean = np.ceil(np.mean(a))
    b_mean = np.ceil(np.mean(b))

    
    return dict({'L':L_mean, 'a':a_mean, 'b':b_mean})

def getLabDict(L, a, b):
    return dict({'L':L, 'a':a, 'b':b})


