window.onload = function() {
  // Définition de la projection
  const projection26192 = new ol.proj.Projection({
    code: 'EPSG:26192',
    units: 'm',
    extent: [-722657.5, 306973.5, 295342.5, 1197715.5], // Extent de la projection UTM
  });

  // Création de la carte
  const map = new ol.Map({
    target: 'js-map',  // Assurez-vous que l'ID du div est correct
    view: new ol.View({
      center: ol.proj.fromLonLat([-7.9364, 31.2994], 'EPSG:4326'),
      zoom: 10,
      projection: projection26192,
    }),
    layers: [
      // Ajout de la couche de base OpenStreetMap
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ]
  });

  // Chargement des couches vectorielles (GeoJSON)
  const vectorLayer1 = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'path/to/your/alhaouzcercles.geojson',  // Remplacez par le bon chemin vers votre fichier GeoJSON
      format: new ol.format.GeoJSON()
    }),
    visible: true, // Visible par défaut
    name: 'alhaouzcercles'  // Nom pour identifier la couche
  });

  const vectorLayer2 = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'path/to/your/alhaouz_pro.geojson',  // Remplacez par le bon chemin vers votre fichier GeoJSON
      format: new ol.format.GeoJSON()
    }),
    visible: true, // Visible par défaut
    name: 'alhaouz_pro'  // Nom pour identifier la couche
  });

  // Ajout des couches vectorielles à la carte
  map.addLayer(vectorLayer1);
  map.addLayer(vectorLayer2);

  // Ajout des couches WMS
  const wmsLayerDetruites = createWmsLayer('detruites');
  const wmsLayerInchanges = createWmsLayer('inchanges');

  // Ajout des couches WMS à la carte
  map.addLayer(wmsLayerDetruites);
  map.addLayer(wmsLayerInchanges);

  // Gestion des icônes d'œil pour activer/désactiver les couches
  setupLayerVisibilityToggle(wmsLayerDetruites, 'eyeDetruites', 'layerDetruites');
  setupLayerVisibilityToggle(wmsLayerInchanges, 'eyeInchanges', 'layerInchanges');

  // Sélection des caractéristiques et affichage des informations
  setupFeatureSelection(map);

  // Vérification de la carte dans la console
  console.log("Carte OpenLayers avec deux couches WMS et gestion des icônes d'œil chargée");
};

// Fonction pour créer les couches WMS
function createWmsLayer(layerName) {
  return new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/decoupe1admin/wms',
      params: {
        'LAYERS': `decoupe1admin:${layerName}`,  // Nom de la couche
        'SRS': 'EPSG:26192',
        'FORMAT': 'image/png'
      },
      serverType: 'geoserver',
      opacity: 0.7
    }),
    visible: true
  });
}

// Fonction pour gérer la visibilité des couches via icônes d'œil
function setupLayerVisibilityToggle(layer, eyeIconId, layerToggleId) {
  const eyeIcon = document.getElementById(eyeIconId);
  document.getElementById(layerToggleId).addEventListener('click', function() {
    toggleLayerVisibility(layer, eyeIcon);
  });
}

// Fonction pour basculer la visibilité des couches et changer l'icône
function toggleLayerVisibility(layer, eyeIcon) {
  const isVisible = layer.getVisible();
  layer.setVisible(!isVisible);
  eyeIcon.src = isVisible ? 'closed.png' : 'opened.png'; // Basculer entre les deux icônes
}

// Fonction de sélection des caractéristiques et affichage des informations dans l'interface
function setupFeatureSelection(map) {
  const selectInteraction = new ol.interaction.Select();
  map.addInteraction(selectInteraction);

  selectInteraction.on('select', function(event) {
    var selectedFeature = event.selected[0];
    if (selectedFeature) {
      var properties = selectedFeature.getProperties();
      console.log(properties);  // Affiche tout le contenu de 'properties'
      updateInfoBox(properties);
    }
  });

  map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature;
    });

    if (feature) {
      var properties = feature.getProperties();
      updateInfoBox(properties);
    } else {
      clearInfoBox();
    }
  });
}

// Fonction pour mettre à jour la boîte d'informations avec les propriétés de la feature sélectionnée
function updateInfoBox(properties) {
  document.getElementById('circleName').textContent = properties.name || 'Nom inconnu';
  document.getElementById('stat_detr_').textContent = properties.stat_detr_ !== undefined ? properties.stat_detr_ : '0';
  document.getElementById('stat_incha').textContent = properties.stat_incha !== undefined ? properties.stat_incha : '0';
}

// Fonction pour effacer les informations affichées dans la boîte d'informations
function clearInfoBox() {
  document.getElementById('circleName').textContent = 'Aucun élément sélectionné';
  document.getElementById('stat_detr_').textContent = '0';
  document.getElementById('stat_incha').textContent = '0';
}
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');