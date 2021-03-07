import numpy as np
import pandas as pd
import csv

data_file = pd.read_excel('PPG-BP dataset.xlsx', dtype=str)

data_file.to_csv('data.csv')

data = np.genfromtxt('data.csv', dtype=str ,delimiter=',')
data = data[1:, 3:-3]

hy = {"Normal":0, "Prehypertension":1, "Stage 1 hypertension":2, "Stage 2 hypertension": 3}
sex = {"Female":0, "Male":1}

for i in range(1, data.shape[0]):
    data[i, 8] = hy[data[i,8]]
    data[i, 0] = sex[data[i, 0]]

np.savetxt('data.csv', data, delimiter=',', fmt="%s")
