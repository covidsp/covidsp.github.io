import csv
import requests
import json
import datetime
from sys import exit
import pandas as pd
import time
date = datetime.datetime.now().strftime('%Y-%m-%d')
#date = datetime.datetime(2020,3,27).strftime('%Y-%m-%d')
CSV_URL = 'https://brasil.io/dataset/covid19/caso?state=SP&place_type=city&is_last=True&format=csv'
CSV_URL = 'https://brasil.io/dataset/covid19/caso?state=SP&place_type=city&format=csv'
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
    df.loc[df.deaths=='','deaths'] = '0'
    df['deaths'] = df['deaths'].astype(int)
    df['date'] = pd.to_datetime(df.date)
    jsonall = {}
    for d in range(0,(df.date.max()-df.date.min()).days+1):    
        if df[df.date==df.date.min()+datetime.timedelta(days=d)].shape[0]>0 and (df.date.min()+datetime.timedelta(days=d)).strftime('%d-%m-%Y') != '24-03-2020':
            print ((df.date.min()+datetime.timedelta(days=d)).strftime('%d-%m-%Y'))
            df_2 = df[df.date==df.date.min()+datetime.timedelta(days=d)]
            df_2['date'] = df_2['date'].dt.strftime('%d-%m-%Y')
            jsonall[(df.date.min()+datetime.timedelta(days=d)).strftime('%d-%m-%Y')] = df_2.to_dict(orient='records')
        else:
            jsonall[(df.date.min()+datetime.timedelta(days=d)).strftime('%d-%m-%Y')] = df_2.to_dict(orient='records')
    with open('C:/Covid_Oficial/covidsp.github.io/files/Casos.json', 'w') as outfile:
        outfile.write('var cases = '+str(jsonall))
    with open('C:/Covid_Oficial/covidsp.github.io/files/date.json', 'w') as outfile:
        outfile.write('var date_at ="'+ df.date.max().strftime('%d-%m-%Y')+'"')

    CSV_URL = 'https://brasil.io/dataset/covid19/caso?state=SP&place_type=city&format=csv'
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
    df.loc[df.deaths=='','deaths'] = '0'
    df['deaths'] = df['deaths'].astype(int)
    df['date'] = pd.to_datetime(df.date)
    df_grp = df.groupby('date').confirmed.sum().reset_index().rename(columns={'date':'x','confirmed':'y'})
    df_grp = df_grp[df_grp.y>0]
    jsondata = df_grp.to_json(orient='records')
    with open('C:/Covid_Oficial/covidsp.github.io/files/av_sp.json', 'w') as outfile:
        outfile.write('var av_sp = '+jsondata)
    print ('Updating...')
def updateGit():
    import subprocess as cmd
    cp = cmd.run("dir", check=True, shell=True)
    cp = cmd.run("git add --all", check=True, shell=True)
    #print(cp)
    time.sleep(2)
    cp = cmd.run(f"git commit -m Commit", check=True, shell=True)
    cp = cmd.run("git push -u origin master -f", check=True, shell=True)
updateGit()