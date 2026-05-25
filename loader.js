const externalLayers = [

    'layers/mouza.js',
    'layers/mouza2.js', 
    'layers/street.js',
    'layers/measure.js', 
    'layers/latlong.js'

];

externalLayers.forEach(file => {

    const script = document.createElement('script');

    script.src = file;

    document.body.appendChild(script);

});