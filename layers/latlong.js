(function waitForMap() {

    // Wait until map exists
    if (!window.map) {
        setTimeout(waitForMap, 200);
        return;
    }

    // Create coordinate box
    const coordsDiv = document.createElement("div");

    coordsDiv.id = "coords";

    coordsDiv.style.position = "absolute";
    coordsDiv.style.bottom = "10px";
    coordsDiv.style.right = "10px";
    coordsDiv.style.background = "rgba(0,0,0,0.7)";
    coordsDiv.style.color = "white";
    coordsDiv.style.padding = "6px 10px";
    coordsDiv.style.borderRadius = "4px";
    coordsDiv.style.fontSize = "13px";
    coordsDiv.style.fontFamily = "Arial";
    coordsDiv.style.zIndex = "9999";

    coordsDiv.innerHTML = "Lat: -- | Lng: --";

    document.body.appendChild(coordsDiv);

    // Mouse move event
    window.map.on("mousemove", function(e) {

        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        coordsDiv.innerHTML =
            "Lat: " + lat + " | Lng: " + lng;
    });

})();