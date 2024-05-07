import pandas as pd
from flask import Flask, render_template
import json
import pandas
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler, MinMaxScaler,RobustScaler

app = Flask(__name__)

@app.route('/')
def hello_world():
    with open('caCountiesTopoSimple.json') as f:
        urateMap = chloropleth_datasets('Unemployment Rate')
        eMap = chloropleth_datasets('Employment')
        ueMap = chloropleth_datasets('Unemployment')
        avgMap = chloropleth_datasets('Average Weekly Wages')
        estMap = chloropleth_datasets('Establishments')
        lMap = chloropleth_datasets('Labor Force')
        excapMap = chloropleth_datasets('Expenditures Per Capita')
        ameMap = chloropleth_datasets('Average Monthly Employment')
        twMap = chloropleth_datasets('Total Wages (All Workers)')
        epMap = chloropleth_datasets('Estimated Population')
        texpMap = chloropleth_datasets('Total Expenditures')
        heatMapData = getHMData()

        json_data = json.load(f)
        lineChartData = getAllData()
        data = pd.read_csv('ca_unemployment.csv')
        columns_to_normalize  = ['Labor Force', 'Employment', 'Unemployment', 'Average Monthly Employment', 
                    'Total Wages (All Workers)', 'Establishments', 'Total Expenditures', 'Estimated Population', 
                    'Expenditures Per Capita']
        scaler = RobustScaler()
        data[columns_to_normalize] = scaler.fit_transform(data[columns_to_normalize])
        dropDownData = getCounties()
        attributesData = getAttributes()
        data_json = data.to_json(orient='records')
        return render_template('index.html',jsonData = json_data, uRateMap = urateMap, eMap = eMap, uEMap = ueMap, avgMap = avgMap, ldData = lineChartData, data = data_json,dropDownData = dropDownData,attributesData = attributesData, heatMap = heatMapData,estMap = estMap,lMap = lMap,excapMap = excapMap,ameMap = ameMap,twMap = twMap,epMap = epMap,texpMap = texpMap)

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
    print(totalData)
    return totalData

def getHMData():
    df = pd.read_csv('ca_unemployment.csv')
    years = df['Year'].unique()
    heatMap = {}

    for year in years:
        df_filtered = df[df['Year'] == year].select_dtypes(include=['float64', 'int64'])
        df_filtered = df_filtered.drop(columns=['Year'])
        correlation_matrix = df_filtered.corr()
        correlation_list = []
        for group in correlation_matrix.index:
            for variable in correlation_matrix.columns:
                correlation_list.append({
                    'group': group,
                    'variable': variable,
                    'value': correlation_matrix.loc[group, variable]
                })
        heatMap[int(year)] = correlation_list

    return heatMap

if __name__ == '__main__':
    app.run()
