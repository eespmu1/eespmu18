fetch('mouzabound.geojson')

.then(r => r.json())

.then(data => {

    const mouzaLayer = L.geoJSON(data, {

        style: {
            color: 'yellow',
            weight: 1,
            fillOpacity: 0
        },

        onEachFeature: function(feature, layer) {

            const props = feature.properties;

            const district = props.district || 'N/A';
            const mouza = props.MOUZA || 'N/A';
            const block = props.BLOCK || 'N/A';
            const area = props.MA || 'N/A';

            const tooltipContent = `
                <div style="
                    font-size:13px;
                    line-height:1.5;
                    padding:4px;
                ">
                    <b>District:</b> ${district}<br>
                    <b>Mouza:</b> ${mouza}<br>
                    <b>Block:</b> ${block}<br>
                    <b>Mouza Area (Ha):</b> ${area}
                </div>
            `;

            /* Hover Tooltip */

            layer.bindTooltip(tooltipContent, {
                sticky: true,
                direction: 'top',
                opacity: 0.95
            });

            /* Highlight on Hover */

            layer.on('mouseover', function() {

                this.setStyle({
                    color: 'red',
                    weight: 3,
                    fillOpacity: 0.15
                });

            });

            /* Reset Style */

            layer.on('mouseout', function() {

                mouzaLayer.resetStyle(this);

            });

        }

    });

    mouzaLayer.addTo(window.map);

});