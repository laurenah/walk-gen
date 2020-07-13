// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import config from './mapbox-key';
import {process, convertToCoords} from './coord-processor';
import {updateRoute} from './route';

// API Key
mapboxgl.accessToken = config;

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
            zoom: 14
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
            distValue: 3
        };

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
        console.log('Start: ' + this.state.startValue + ", Distance: " + this.state.distValue);

        let routeLegs = process(this.state.distValue * 1000); // get splits
        routeLegs = convertToCoords(this.props.lat, this.props.lng, routeLegs);
        updateRoute(routeLegs, mapboxgl.accessToken);

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

ReactDOM.render( < Application / > , document.getElementById('app'));