import pandas as pd
from sqlalchemy import create_engine
from flask import Flask, render_template, jsonify
from flask_cors import CORS
import json

database = {'user': 'root', 
            'password': 'Arizona1!',
            'port': '3306',
            'host': 'localhost',
            'database': 'obesity' }

db_engine = create_engine("""mysql://%s:%s@%s:%s/%s
    """ % (database["user"], database["password"], database["host"], database["port"], database["database"]),
    echo=False)

# Flask "app" Setup
app = Flask(__name__)
CORS(app)

@app.route("/")
def main():
    return render_template("obesity_web.html")

@app.route("/chloropleth")
def chloropleth():
    return render_template("chloropleth.html")

@app.route("/both")
def hehat_chlo():
    return render_template("heat_chlo.html")
# create route that renders index.html template
@app.route("/get_data")
def home():
    geojson = {
        "type":"FeatureCollection",
        "features":[]
        }
    df = db_engine.execute("select distinct * from obesity_by_county;")
    results = {'result': [dict(row) for row in df]}
    for info in results["result"]:
        geojson_obj = {}
        geojson_obj["type"] = "Feature"
        geojson_obj["geometry"] = {}
        geojson_obj["geometry"]["type"] = "Point"
        geojson_obj["geometry"]["coordinates"] = [info["Long"], info["Lat"], float(info['Pop In Poverty %'].strip('%'))]
        geojson_obj["properties"] = {}
        geojson_obj["properties"]["County_Name"] = info['CHSI_County_Name']
        geojson_obj["properties"]["pop_in_poverty"] = info['Pop In Poverty']
        geojson_obj["properties"]["pop_in_poverty_percent"] = info['Pop In Poverty %']
        geojson_obj["properties"]["white_pop_population"] = info['White Pop%']
        geojson_obj["properties"]["black_pop_percentage"] = info['Black Pop%']
        geojson_obj["properties"]["hispanic_pop_percentage"] = info['Hispanic Pop%']
        geojson_obj["properties"]["obesity_percentage"] = info['Obesity Pop %']
        geojson_obj["properties"]["asian_pop_percentage"] = info['Asian Pop %']
        geojson["features"].append(geojson_obj)
    return jsonify(geojson)
 #reverse type : feature
if __name__ == "__main__":
    app.run(debug=True)