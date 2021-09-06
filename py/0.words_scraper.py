import urllib.request as ul
from bs4 import BeautifulSoup as soup
import re
import numpy as np

# Step 1 - Getting to the url
url = 'https://www.pinhok.com/kb/hsk/401/hsk-2-sentences/'
req = ul.Request(url, headers={'User-Agent': 'Mozilla/5.0'})  # Makes it look like
# we are an actual user, instead of bot farming data
client = ul.urlopen(req)
htmldata = client.read()
client.close()

# Step 2 - Finding the data
pagesoup = soup(htmldata, "html.parser")  # takes HTML code
# First identify the HTML structure of the data you want, then feed it under here
# If you are looking for one item, just use find(), instead of findALL()

# 3. Get html sections
# a. Ingredients
tags = pagesoup('td')
name = []

# 4.a Convert ingredients into a list
count = 1
for tag in tags:
    if count % 2 == 0:
        name.append(tag.text.strip())
    count += 1
print(name)

np.savetxt("hsk2_sentences.txt", 
           name,
           delimiter ="\t", 
           fmt ='% s')

    
