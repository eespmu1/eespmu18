/* =========================================
   SIMPLE DISTANCE & AREA MEASUREMENT TOOL
========================================= */

let measureMode = false;
let measureType = null;

let measurePoints = [];
let measureLine = null;
let measurePolygon = null;
let measureMarkers = [];

const measureLayer = L.layerGroup().addTo(window.map);

/* ==============================
   CONTROL PANEL
============================== */

const measureControl = L.control({ position: 'topright' });

measureControl.onAdd = function () {

    const div = L.DomUtil.create('div');

    div.innerHTML = `
    
    <div style="
        background:white;
        padding:10px;
        border-radius:8px;
        box-shadow:0 0 10px rgba(0,0,0,0.3);
        font-size:13px;
        min-width:140px;
    ">

        <div style="
            font-weight:bold;
            margin-bottom:8px;
            text-align:center;
        ">
            Measure Tool
        </div>

        <button id="distanceBtn"
        style="
            width:100%;
            margin-bottom:5px;
            padding:6px;
            cursor:pointer;
        ">
            Measure Distance
        </button>

        <button id="areaBtn"
        style="
            width:100%;
            margin-bottom:5px;
            padding:6px;
            cursor:pointer;
        ">
            Measure Area
        </button>

        <button id="clearMeasureBtn"
        style="
            width:100%;
            padding:6px;
            cursor:pointer;
        ">
            Clear
        </button>

    </div>
    `;

    return div;
};

measureControl.addTo(window.map);

/* Prevent map drag when clicking control */

document.addEventListener('click', function(e){

    if(e.target.id === 'distanceBtn') {

        startDistanceMeasure();

    }

    if(e.target.id === 'areaBtn') {

        startAreaMeasure();

    }

    if(e.target.id === 'clearMeasureBtn') {

        clearMeasurements();

    }

});

/* ==============================
   START DISTANCE
============================== */

function startDistanceMeasure() {

    clearMeasurements();

    measureMode = true;
    measureType = 'distance';

    alert('Click points on map. Double click to finish.');

}

/* ==============================
   START AREA
============================== */

function startAreaMeasure() {

    clearMeasurements();

    measureMode = true;
    measureType = 'area';

    alert('Click polygon points. Double click to finish.');

}

/* ==============================
   MAP CLICK
============================== */

window.map.on('click', function(e){

    if(!measureMode) return;

    const latlng = e.latlng;

    measurePoints.push(latlng);

    const marker = L.circleMarker(latlng,{
        radius:5,
        color:'red',
        fillColor:'yellow',
        fillOpacity:1
    }).addTo(measureLayer);

    measureMarkers.push(marker);

    drawMeasurement();

});

/* ==============================
   DOUBLE CLICK FINISH
============================== */

window.map.on('dblclick', function(){

    if(!measureMode) return;

    finishMeasurement();

});

/* ==============================
   DRAW
============================== */

function drawMeasurement() {

    if(measureLine) {
        measureLayer.removeLayer(measureLine);
    }

    if(measurePolygon) {
        measureLayer.removeLayer(measurePolygon);
    }

    if(measureType === 'distance') {

        measureLine = L.polyline(measurePoints,{
            color:'cyan',
            weight:3
        }).addTo(measureLayer);

    }

    if(measureType === 'area') {

        measurePolygon = L.polygon(measurePoints,{
            color:'lime',
            weight:2,
            fillOpacity:0.2
        }).addTo(measureLayer);

    }

}

/* ==============================
   FINISH
============================== */

function finishMeasurement() {

    measureMode = false;

    if(measureType === 'distance') {

        let totalDistance = 0;

        for(let i=1;i<measurePoints.length;i++) {

            totalDistance += measurePoints[i-1]
            .distanceTo(measurePoints[i]);

        }

        const km = (totalDistance/1000).toFixed(3);

        L.popup()
        .setLatLng(measurePoints[measurePoints.length-1])
        .setContent(`
            <b>Total Distance</b><br>
            ${km} km
        `)
        .openOn(window.map);

    }

    if(measureType === 'area') {

        const latlngs = measurePoints.map(p => [p.lng,p.lat]);

        latlngs.push([measurePoints[0].lng,measurePoints[0].lat]);

        const area = calculatePolygonArea(latlngs);

        const hectare = (area/10000).toFixed(3);

        L.popup()
        .setLatLng(measurePoints[measurePoints.length-1])
        .setContent(`
            <b>Polygon Area</b><br>
            ${hectare} Ha
        `)
        .openOn(window.map);

    }

}

/* ==============================
   CLEAR
============================== */

function clearMeasurements() {

    measureMode = false;

    measurePoints = [];

    measureLayer.clearLayers();

}

/* ==============================
   AREA CALCULATION
============================== */

function calculatePolygonArea(coords) {

    let area = 0;

    const R = 6378137;

    for(let i=0;i<coords.length-1;i++) {

        const p1 = coords[i];
        const p2 = coords[i+1];

        area += (
            (p2[0]-p1[0]) *
            Math.PI/180 *
            R *
            (
                2 +
                Math.sin(p1[1]*Math.PI/180) +
                Math.sin(p2[1]*Math.PI/180)
            )
        );

    }

    area = area * R / 2;

    return Math.abs(area);

}