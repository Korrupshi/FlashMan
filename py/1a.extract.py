# Extract json files from tsv
import json
import pandas as pd

# 1. Choose data file
fname = 'A1_2'  # Change this to change main data file

data = pd.read_csv(f'data/{fname}.txt', header=None, sep='\t')
df = data.iloc[:,0].tolist()

# a. Get Eng Mandarin
eng = []
for i in df[2::4]:
    eng.append(i)

han = []
for i in df[0::4]:
    han.append(i)

pin = []
for i in df[1::4]:
    pin.append(i)

# b. Merge
jlist = []
out = {}

for i in range(len(pin)):
    z = eng[i]
    jlist = []
    jlist.append(pin[i])
    jlist.append(han[i])
    out[z] = jlist

with open(f'data/{fname}.json', "w", encoding="utf8") as json_file: 
    json.dump(out, json_file, indent=4, ensure_ascii=False)