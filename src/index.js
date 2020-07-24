// Imports
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import config from './mapbox-key';
import {WalkForm} from './WalkForm';

// API Key
mapboxgl.accessToken = config;
var map = '';
export {map};

// Application Component - App base
class Application extends Component {

    render() {
        return (
            <Map/>
        )
    }
}

// Map Component - Draws Map
class Map extends Component {
    constructor(props) {
        super(props);
        // starting long/lat and zoom
        this.state = {
            lng: 145,
            lat: -37.95,
            zoom: 14
        };
    }

    componentDidMount() {
        // map creation
        map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        // get current location if available
        if ('geolocation' in navigator) {
            // get the latitude and longitude from the navigator object
            // and set the state's variables to those values
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    lng: position.coords.longitude.toFixed(4),
                    lat: position.coords.latitude.toFixed(4),
                    zoom: this.state.zoom
                });

               var center = new mapboxgl.LngLat(this.state.lng, this.state.lat);
               map.setCenter(center);
            });
        } else {
            console.log("location unavailable");
        }

        // save state of map as the user moves it around and zooms
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });
    }

    // variables passed into WalkForm are accessed as props
    render() {
        return (
            <div>
                <div className='formWrapper'>
                    <WalkForm lat = {this.state.lat} lng = {this.state.lng} /> 
                </div>
                <div ref={el => this.mapContainer = el} className="mapContainer" />
            </div>
        )
    }
}

ReactDOM.render( < Application / > , document.getElementById('app'));