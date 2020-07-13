// to process direction of route legs
// will take convertToCoords from coord-processor.js

export function updateRoute(featureCollection, token) {
    // set the profile
    var profile = "walking";
    // get the coords that were drawn on the map
    var data = featureCollection;
    var lastFeature = data.features.length - 1;
    var coords = data.features[lastFeature].geometry.coordinates;
    // format the coords
    var newCoords = coords.join(';');
    // set the radius for each coordinate pair to 25 meters
    var radius = [];
    coords.forEach(item => {
        radius.push(25);
    });
    getMatch(newCoords, radius, profile, token);
}

// Make a map matching request
function getMatch(coordinates, radius, profile, token) {
    // Separate the radiuses with semicolons
    var radiuses = radius.join(';');
    // create the query
    var query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates 
    + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + token;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', query);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
        } else {
            console.log('request failed');
        }
    };
    xhr.send();
    // $.ajax({
    //     method: 'GET',
    //     url: query
    // }).done(function(data) {
    //     // get the coords from the response
    //     var coords = data.matchings[0].geometry;
    //     console.log(coords);
    //     // code for the next step goes here
    // })
}