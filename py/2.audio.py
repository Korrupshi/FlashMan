## Auto generates TTS (text to speach) from mandarin

from gtts import gTTS
import pandas as pd
import json
import sys

fname = sys.argv[1]
# fname = 'hsk2_words'

with open(f'./data/deck/{fname}.json', 'r', encoding="utf8") as openfile:
        data = json.load(openfile)  # Reading from json file

audio = []
for k,v in data.items():
    audio.append(v[1])

#count = -1
for i in range(len(audio)):
    #count += 1
    tts = gTTS(audio[i], lang= 'zh-CN')
    tts.save(f'./data/audio/{fname}-{i}.wav')

print(fname + ' Audio has been generated, Python')

sys.stdout.flush()