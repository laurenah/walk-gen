// Imports
import React, {Component} from 'react';
import {map} from './Map'; // map object
import {process, convertToCoords} from '../coord-processor'; // functions for processing lat/lng
import config from '../mapbox-key'; // externally stored mapbox API token
import mapboxgl from 'mapbox-gl';

// access API Key
mapboxgl.accessToken = config;

// WalkForm Component - handles form for configuring the walk
class WalkForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startValue: '',
            distValue: 3
        };

        // change function bindings for HTML form
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleDistChange = this.handleDistChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // sets start value to whatever is in the start textbox
    handleStartChange(event) {
        this.setState({
            startValue: event.target.value,
            distValue: this.state.distValue
        });
    }

    // sets distance value to whatever is in the distance textbox
    handleDistChange(event) {
        this.setState({
            startValue: this.state.startValue,
            distValue: event.target.value
        });
    }

    // handles submit of form
    handleSubmit(event) {
        let routeLegs = process(this.state.distValue * 1000); // get splits
        routeLegs = convertToCoords(this.props.lat, this.props.lng, routeLegs); // convert splits to coordinates
        updateRoute(routeLegs, mapboxgl.accessToken); // get a drawable route from the coords
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className='form-group row'>
                    <label htmlFor='inputStart' className='col-3 col-lg-3 walkFormLabel'>Start</label>
                    <div className='col-9 col-lg-9 walkFormInput'>
                        <input type='text' value={this.state.startValue} onChange={this.handleStartChange} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='inputDist' className='col-3 col-lg-3 walkFormLabel'>Distance</label>
                    <div className='col-3 col-lg-3 walkFormDist'>
                        <input type='text' value={this.state.distValue} onChange={this.handleDistChange} />
                    </div>
                    <div className="col-6 col-lg-6 km">
                        <label>km</label>
                    </div>
                </div>
                <input className="routeBtn" type='submit' value="Generate Route"/>
            </form>
        )
    }
}

// to process direction of route legs, this function
// will take featureCollection generated from coord-processor.js
function updateRoute(featureCollection, token) {
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

    // ASYNC GET Request to get Mapbox Map Matching result
    var xhr = new XMLHttpRequest();
    xhr.open('GET', query);
    xhr.onload = function() {
        if (xhr.status === 200) { // if response OK parse into JSON object
            var data = JSON.parse(xhr.responseText);
            console.log(data); 
            var coords = data.matchings[0].geometry;
            addRoute(coords);
        } else {
            alert("Uh oh! I couldn't process your request! Please try again.");
        }
    };
    xhr.send();
}

// draw the route as a new layer on the map
function addRoute(coords) {
    // if a route is already loaded, remove it
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
        addRoute(coords); // call again to re-draw
    } else { // add a new layer to the map
        map.addLayer({
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": coords
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#03AA46",
                "line-width": 8,
                "line-opacity": 0.8
            }
        });
    }
}

// Export
export {WalkForm};
