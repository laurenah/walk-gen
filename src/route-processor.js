export function process(distance) {
    // generate a random number of turns to draw between 5 and 15
    let randomTurns = Math.floor(Math.random() * (15 - 5)) + 5;
    let distances = generateRandoms(distance, randomTurns);
    return distances;
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

    // shuffle the distances
    shuffle(distances);
    console.log(distances);
    return distances;
}

// convert distances to coordinates
export function convertToCoords(lat, lng, distances) {
    let meterValue = 0.0000045625; // latitude equivalent of 1 meter
    let coords = [];
    for (let i = 0; i < distances.length; i++) {
        let coordChange = lat + (distances[i] * meterValue); // add distance to latitude
        coords.push(lng + "," + coordChange);
    }

    return coords;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
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