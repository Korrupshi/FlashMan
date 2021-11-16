
## Translate English into Mandarin + Pinyin
from mtranslate import translate
from xpinyin import Pinyin
import json
import pandas as pd
import os, sys

# os.system('cls')
pinyin = Pinyin() 

# 1. Inputs
# a. names
fname = sys.argv[1]

# b. execute what translation
trans_1 = str(input('Which translations do you need?\n 0 (none), 1 (eng), 2(pin), 3(ch): '))

# options: 0 = audio only, 2 = pin only, 1 = eng only, 12 = eng+pin, 23 = pin + ch

# 2. Translate
data = pd.read_csv(f'data\\{fname}.txt', sep='\t')
eng = []
pin = []
han = []

def get_translate():
    global trans_1
    global eng
    global pin
    global han

    if trans_1 == '0':  # Get Audio only
        eng = data.iloc[:,0].tolist()
        pin = data.iloc[:,1].tolist()
        han = data.iloc[:,1].tolist()

    elif trans_1 == '1':  # Get Eng 
        pin = data.iloc[:,0].tolist()
        han = data.iloc[:,1].tolist()
        eng = []

        print('Translating...')
        for i in han:
            x = translate(i,"en")
            eng.append(x)

    elif trans_1 == '2':  # Get Pin
        eng = data.iloc[:,0].tolist()
        han = data.iloc[:,1].tolist()
        pin = []

        for i in han:
            y = pinyin.get_pinyin(i,  ' ',tone_marks='marks')
            pin.append(y)

    elif trans_1 == '23':  # Get Pin + Han
        eng = data.iloc[:,0].tolist()
        han = []
        pin = []

        # a. Get Mandarin
        print('Translating...')
        for i in eng:
            x = translate(i,"zh-CN")
            han.append(x)

        # b. Get pinyin
        pin = []
        for i in han:
            y = pinyin.get_pinyin(i,  ' ',tone_marks='marks')
            pin.append(y)

    elif trans_1 == '12':  # Get Eng + Pin
        han = data.iloc[:,0].tolist()
        eng = []
        pin = []
        
        print('Translating...')
        for i in han:
            x = translate(i,"en")
            eng.append(x)

        for i in han:
            y = pinyin.get_pinyin(i,  ' ',tone_marks='marks')
            pin.append(y)

    else:
        trans_1 = str(input('Which translations do you need?\n 0 (none), 1 (eng), 2(pin), 3(ch)\n (Example: "12"): '))
        get_translate()

get_translate()
# 3. Export json + tsv
jlist = []
out = {}

for i in range(len(pin)):
    jlist = []
    jlist.append(eng[i])
    jlist.append(pin[i])
    jlist.append(han[i])
    out[i] = jlist

with open(f'data/deck/{fname}.json', "w", encoding="utf8") as json_file: 
    json.dump(out, json_file, indent=4, ensure_ascii=False)

# b. Export tsv
eng = []
pin = []
han = []
for k,v in out.items():
    eng.append(v[0])
    pin.append(v[1])
    han.append(v[2])
out2 = pd.DataFrame(list(zip(eng, pin, han)), columns =['###Eng', 'Pin','Han'] )

# Export .txt file
out2.to_csv(f'data\\{fname}.txt', sep = '\t', index=False)
print('Vocabulary successfully translated!')

# 4. Create audio
from gtts import gTTS
import pandas as pd
import json

audio = []
for i in han:
    audio.append(i)

print('Generating audio...')

for i in range(len(audio)):
    tts = gTTS(audio[i], lang= 'zh-CN')
    tts.save(f'data\\audio\\{fname}-{i}.wav')
print('Audio successfully generated!')

sys.stdout.flush()