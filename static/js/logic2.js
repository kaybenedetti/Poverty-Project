var myMap = L.map("map", {
  center: [38.39, -100.38],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }
).addTo(myMap);





var APILink = "https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json";
var geojson;

// Grabbing data with d3...
d3.json(APILink, function(data2) {
console.log(data2)
  // Creating a new choropleth layer
  geojson = L.choropleth(data2, {
    // Which property in the features to use
    valueProperty: "STATEFP10",
    // Color scale
    scale: ["#0A2F51", "#1D9A6C"],
    // Number of breaks in step range
    steps: 10,
    // q for quantile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.4
    },
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup('feature.properties.COUNTY' + " " + 'feature.properties.State' + "<br>Median Household Income:<br>" +
        "$" + feature.properties.ALAND10);
    }
  }).addTo(myMap);
});