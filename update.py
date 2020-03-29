import csv
import requests
import json
import datetime
from sys import exit
import pandas as pd
#date = datetime.datetime.now().strftime('%Y-%m-%d')
date = datetime.datetime(2020,3,27).strftime('%Y-%m-%d')
CSV_URL = 'https://brasil.io/dataset/covid19/caso?date='+date+'&state=SP&place_type=city&format=csv'
with requests.Session() as s:
    download = s.get(CSV_URL)

    decoded_content = download.content.decode('utf-8')

    cr = csv.reader(decoded_content.splitlines(), delimiter=',')
    my_list = list(cr)
    df = pd.DataFrame(my_list)
    if df.empty:
        exit(0)
    df.columns = df.iloc[0]
    df = df.drop(0)
    date = df.iloc[0].date
    df['confirmed'] = df['confirmed'].astype(int)
    df['deaths'] = df['deaths'].astype(int)
    #df = df.groupby('city_ibge_code').agg({'confirmed':'sum','deaths':'sum'}).reset_index()
    jsondata = df.to_json(orient='records')
    jsondata = 'var cases = '+jsondata
    with open('files/Casos.json', 'w') as outfile:
        outfile.write(jsondata)
    with open('files/date.json', 'w') as outfile:
        outfile.write('var date_at ="'+ date+'"')
    print ('Updating...')
def updateGit():
    import subprocess as cmd
    cp = cmd.run("dir", check=True, shell=True)
    cp = cmd.run("git add --all", check=True, shell=True)
    #print(cp)
    message = "update the repository"
    cp = cmd.run(f"git commit -m '{message}'", check=True, shell=True)
    cp = cmd.run("git push -u origin master -f", check=True, shell=True)
updateGit()