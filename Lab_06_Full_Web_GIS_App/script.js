// TASK 1: Paste map creation code here
const map = L.map("map").setView([27.5, 90.4], 8);


// TASK 2: Paste basemap code here
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);


// TASK 3: Paste layer group code here
const ExposureLayer = L.layerGroup().addTo(map);
const PM25Layer = L.layerGroup().addTo(map);
const PopulationLayer = L.layerGroup().addTo(map);


// TASK 4: Paste zoom function here
function zoomToBhutan() {
  map.setView([27.5, 90.4], 8);
}


// TASK 5: Paste GeoJSON layer loading code here
fetch("../Data/Bhutan_Exposure.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "black",
        weight: 1,
        fillColor: "orange",
        fillOpacity: 0.3
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("EXposure value");
      }
    }).addTo(ExposureLayer);
  });

fetch("../Data/Bhutan_PM2.5.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("PM2.5 value");
      }
    }).addTo(educationLayer);
  });

fetch("../Data/Bhutan_population.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          color: "red",
          fillColor: "red",
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("population_density");
      }
    }).addTo(healthLayer);
  });


// TASK 6: Paste layer control code here
const overlayMaps = {
  "Exposure Risk Map": ExposureLayerLayer,
  "PM2.5 Concentation": PM25Layer,
  "Population": PopulationLayerLayer
};

L.control.layers(null, overlayMaps).addTo(map);


// SEARCH FUNCTION
function searchLocation() {
  const query = document.getElementById("searchBox").value.toLowerCase();

  dzongkhagLayer.eachLayer(function(layer) {
    const name = layer.feature.properties.name.toLowerCase();

    if (name.includes(query)) {
      map.fitBounds(layer.getBounds());
      layer.openPopup();
    }
  });
}


// =====================================================
// ✅ AREA MEASUREMENT TOOL (ADDED ONLY)
// =====================================================

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  position: "topleft",
  draw: {
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false,
    polygon: {
      allowIntersection: false,
      showArea: true
    }
  },
  edit: {
    featureGroup: drawnItems
  }
});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;
  drawnItems.addLayer(layer);
});