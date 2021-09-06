# Convert TSV to json

## Translate English into Mandarin + Pinyin
import json
import pandas as pd
import sys

fname = 'hsk2_words'

# 1. Choose data file
# fname = 'A1_'  # Change this to change main data file

data = pd.read_csv(f'data/{fname}.txt', sep='\t')
eng = []
eng = data.iloc[:,0].tolist()
pin = data.iloc[:,1].tolist()
han = data.iloc[:,2].tolist()

jlist = []
out = {}

for i in range(len(pin)):
    z = eng[i]
    jlist = []
    jlist.append(pin[i])
    jlist.append(han[i])
    out[z] = jlist

with open(f'data/deck/{fname}.json', "w", encoding="utf8") as json_file: 
    json.dump(out, json_file, indent=4, ensure_ascii=False)

print(fname + ' Successfully translated, Python')

