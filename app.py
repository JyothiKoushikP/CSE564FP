import pandas as pd
from flask import Flask, render_template
import json
import pandas

app = Flask(__name__)

# load california geojson data
@app.route('/')
def hello_world():
    with open('caCountiesTopoSimple.json') as f:
        urateMap = chloropleth_datasets('Unemployment Rate')
        eMap = chloropleth_datasets('Employment')
        ueMap = chloropleth_datasets('Unemployment')
        avgMap = chloropleth_datasets('Average Weekly Wages')
        json_data = json.load(f)
    lineChartData = getAllData()
    return render_template('index.html',jsonData = json_data, uRateMap = urateMap, eMap = eMap, uEMap = ueMap, avgMap = avgMap, ldData = lineChartData)

def chloropleth_datasets(attribute):
    totalProcessed = {}
    df = pd.read_csv('ca_unemployment.csv')
    years = df['Year'].unique()
    counties = df['Area Name'].unique()
    for year in years:
        if year not in totalProcessed:
            year = int(year)
            totalProcessed[year] = {}
            totalProcessedList = {}
            for county in counties:
                totalProcessedList[county] = float(df[(df['Area Name'] == county) & (df['Year'] == year)][attribute])
            totalProcessed[year] = totalProcessedList
    return totalProcessed

def getCounties():
    df = pd.read_csv('ca_unemployment.csv')
    counties = list(df['Area Name'].unique())
    counties.remove('California')
    return counties

def getAttributes():
    df = pd.read_csv('ca_unemployment.csv')
    attributes = list(df.columns)
    attributes.remove('Area Name')
    attributes.remove('Area Type')
    attributes.remove('Year')
    return list(attributes)

def getAllData():
    df = pd.read_csv('ca_unemployment.csv')
    totalData = {}
    counties = getCounties()
    years = df['Year'].unique()
    attributes = getAttributes()
    for county in counties:
        if county not in totalData:
            totalData[county] = {}
        for attribute in attributes:
            list = []
            for year in years:
                list.append(float(df[(df['Area Name'] == county) & (df['Year'] == year)][attribute]))
            totalData[county][attribute] = list
    return totalData

if __name__ == '__main__':
    app.run()
