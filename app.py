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
    return render_template('index.html',jsonData = json_data, uRateMap = urateMap, eMap = eMap, uEMap = ueMap, avgMap = avgMap)

def chloropleth_datasets(attribute):
    totalProcessed = {}
    df = pd.read_csv('ca_unemployment.csv')
    years = df['Year'].unique()
    counties = df['Area Name'].unique()
    for year in years:
        if year not in totalProcessed:
            year = int(year)
            print(type(year))
            totalProcessed[year] = {}
            totalProcessedList = {}
            for county in counties:
                print(type(county))
                totalProcessedList[county] = float(df[(df['Area Name'] == county) & (df['Year'] == year)][attribute])
            totalProcessed[year] = totalProcessedList

    print(totalProcessed)
    return totalProcessed

chloropleth_datasets('Average Weekly Wages')

if __name__ == '__main__':
    app.run()
