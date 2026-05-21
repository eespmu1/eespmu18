window.map.on('contextmenu', function(e) {

    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    const streetViewURL =
        `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;

    L.popup()
    .setLatLng(e.latlng)
    .setContent(`
        <b>Open Street View?</b><br><br>
        <button onclick="window.open('${streetViewURL}','_blank')">
            Open
        </button>
    `)
    .openOn(window.map);

});