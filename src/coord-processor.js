export function process(distance) {
    // generate a random number of turns to draw between 5 and 15
    let randomTurns = Math.floor(Math.random() * (15 - 5)) + 5;
    let distances = generateRandoms(distance, randomTurns); // generate uneven splits
    return distances; // return array of uneven splits
}

function generateRandoms(max, count) {
    let distances = [];
    // split the base distance into uneven splits that will dictate the length
    // of each line drawn
    for (let i = 0; i < count; i++) {
        let random = Math.floor(Math.random() * ((max / (count - i)) - 1)) + 1;
        distances.push(random);
        max -= random;
    }

    // randomise the order distances
    shuffle(distances);
    return distances;
}

// convert distances to coordinates
export function convertToCoords(lat, lng, distances) {
    let latitude = lat;
    let longitude = lng;
    let meterValue = 0.000005; // latitudinal equivalent of 1 meter
    let coords = []; // array to store coordinates
    let coordChange = 0;
    coords.push([parseFloat(longitude), parseFloat(latitude)]); // push starting coords
    for (let i = 0; i < distances.length; i++) {
        // Pick if we're changing latitude or longitude
        if (oneTwoThree() === 1) { // if 1, change latitude
            if (oneOrTwo() === 1) { // if 1 again, positive change 
                coordChange = parseFloat(latitude) + parseFloat(distances[i] * meterValue);
                latitude = coordChange;
            } else { // else, negative change
                coordChange = parseFloat(latitude) - parseFloat(distances[i] * meterValue);
                latitude = coordChange;
            }
            coords.push([parseFloat(longitude), coordChange]);
        } else { // else, change longitude
            if (oneOrTwo() === 1) { // if 1 again, positive change 
                coordChange = parseFloat(longitude) + parseFloat(distances[i] * meterValue);
                longitude = coordChange;
            } else { // else, negative change
                coordChange = parseFloat(longitude) - parseFloat(distances[i] * meterValue);
                longitude = coordChange;
            }
            coords.push([coordChange, parseFloat(latitude)]);
        }
    }

    // finally, append the start point to the list to return home
    coords.push([coords[0][0], coords[0][1]]);
    console.log(coords);

    //convert 2d array into feature collection for mapbox
    let featureCollection = {
        "type": "FeatureCollection",
        "features": [{
            "id": "89901866fa244fb6644f2bd300c6e480",
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": coords,
                "type": "LineString"
            }
        }]
    }

    return featureCollection;
}

// returns 1, 2, or 3
function oneTwoThree() {
    return Math.floor(Math.random() * (3 - 1)) + 1;
}

// returns 1 or 2
function oneOrTwo() {
    return Math.floor(Math.random() * (2 - 1)) + 1;
}

// Randomises a given array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}