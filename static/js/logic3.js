let timerInterval;
Swal.fire({
  title: "",
  html: "Visualization Loading in <strong></strong> seconds.",
  timer: 18000,
  onBeforeOpen: () => {
    Swal.showLoading();
    timerInterval = setInterval(() => {
      Swal.getContent().querySelector(
        "strong"
      ).textContent = Swal.getTimerLeft();
    }, 100);
  },
  onClose: () => {
    clearInterval(timerInterval);
  }
});

var myMap = L.map("map", {
  center: [38.39, -100.38],
  zoom: 4
});
function getColor(d) {
  return d > 50
    ? "#FF0000"
    : d > 40
    ? "#FF6600"
    : d > 30
    ? "#FF9900"
    : d > 20
    ? "#FFCC00"
    : d > 10
    ? "#FFFF00"
    : "#00FF00";
}
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

var APILink =
  "https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json";
var geojson;

// Grabbing data with d3...
d3.json(APILink, function(data2) {
  // Creating a new choropleth layer
  geojson = L.choropleth(data2, {
    // Which property in the features to use
    valueProperty: "STATEFP10",
    // Color scale
    scale: ["#80000D", "#000AFF"],
    // Number of breaks in step range
    steps: 10,
    // q for quantile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 0.5,
      fillOpacity: 0.3
    },
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
          feature.properties.NAMELSAD10
      );
    }
  }).addTo(myMap);
  showHeat();
});

function showHeat () {
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  var baseURL = "/get_data";
  var geojson;
  d3.json(baseURL, function(data) {
    // console.log(data);

    data["features"].map(eachOutput => {
      let location = eachOutput.geometry;
      let level = parseInt(eachOutput.properties.pop_in_poverty_percent);

      if (location) {
        circle = L.circle([location.coordinates[1], location.coordinates[0]], {
          color: getColor(level),
          fillColor: getColor(level),
          fillOpacity: 0.5,
          radius: level * 700
        }).addTo(myMap);
        circle.bindPopup(`${eachOutput.properties.County_Name}
        ${eachOutput.properties.pop_in_poverty}
        ${eachOutput.properties.obesity_percentage}`);
      }

      // Add our marker cluster layer to the map
      //myMap.addLayer(markers);
    });

    // Create Legend
    legend.onAdd = function() {
      // Create div tag with class legend
      var div = L.DomUtil.create("div", "legend");
      pov_scale = [00, 10, 20, 30, 40, 50];
      // Add legend description
      div.innerHTML = "<strong>% Poverty Scale</strong><br>";

      for (var i = 0; i < pov_scale.length; i++) {
        div.innerHTML +=
          '<i style="background-color:' +
          getColor(pov_scale[i] + 1) +
          '">' +
          pov_scale[i] +
          (pov_scale[i + 1] ? "&ndash;" + pov_scale[i + 1] + "<br>" : "+") +
          "</i>";
      }
      return div;
    };
    legend.addTo(myMap);
  });
}
