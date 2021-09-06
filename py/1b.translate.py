
## Translate English into Mandarin + Pinyin
from xpinyin import Pinyin
from mtranslate import translate
import json
import pandas as pd
import sys

fname = sys.argv[1]
pinyin = Pinyin()

# 1. Choose data file
# fname = 'A1_'  # Change this to change main data file

data = pd.read_csv(f'data/{fname}.txt', sep='\t')
eng = []
eng = data.iloc[:,0].tolist()

# a. Get Mandarin
han = []
for i in eng:
    x = translate(i,"zh-CN")
    han.append(x)

# b. Get pinyin
pin = []
for i in han:
    y = pinyin.get_pinyin(i,  ' ',tone_marks='marks')
    pin.append(y)

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

sys.stdout.flush()