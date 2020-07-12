// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import config from './mapbox-key';
import {process, convertToCoords} from './route-processor';

// API Key
mapboxgl.accessToken = config;

// MapMatching API Path
//const matchPath = 'https://api.mapbox.com/maching/v5/mapbox/walking/';
var distance = 3000; // meters to make route ?

// Application Component - App base
class Application extends React.Component {

    render() {
        return (
            <Map />
        )
    }
}

// Map Component - Draws Map
class Map extends React.Component {
    constructor(props) {
        super(props);
        // starting long/lat and zoom
        this.state = {
            lng: 145,
            lat: -37.95,
            zoom: 12
        };
    }

    componentDidMount() {
        // map creation
        const map = new mapboxgl.Map({
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

// WalkForm Component - handles form for configuring the walk
class WalkForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startValue: '',
            endValue: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // sets value to whatever is in the textbox
    handleChange(event) {
        this.setState({
            startValue: event.target.startValue,
            endValue: event.target.endValue
        });
    }

    // handles submit of form
    handleSubmit(event) {
        console.log('Start: ' + this.state.startValue + ", End: " + this.state.endValue);

        let routeLegs = process(distance); // get splits
        routeLegs = convertToCoords(this.props.lat, this.props.lng, routeLegs);
        console.log(routeLegs);

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className='form-group row'>
                    <label htmlFor='inputStart' className='col-2 col-lg-2 walkFormLabel'>Start</label>
                    <div className='col-8 col-lg-8 walkFormInput'>
                        <input type='text' value={this.state.startValue} onChange={this.handleChange} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='inputEnd' className='col-2 col-lg-2 walkFormLabel'>End *</label>
                    <div className='col-8 col-lg-8 walkFormInput'>
                        <input type='text' value={this.state.endValue} onChange={this.handleChange} />
                    </div>
                </div>
                <input type='submit' value="Generate Route"/>
            </form>
        )
    }
}

ReactDOM.render( < Application / > , document.getElementById('app'));