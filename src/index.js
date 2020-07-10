// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibGF1cmVuYWgiLCJhIjoiY2tjZW5oMjF2MGExejMzcWtkYnFyeHI1MyJ9.5lpcvu4s0ArEKQlnhtbxnA';

// Application Component - App base
class Application extends React.Component {
    render() {
        return (
            <Map />
        )
    }
}

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

    render() {
        return (
            <div>
                <div className='formWrapper'>
                    <WalkForm />
                </div>
                <div ref={el => this.mapContainer = el} className="mapContainer" />
            </div>
        )
    }
}

class WalkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        alert('Location: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className='form-group row'>
                    <label for='inputStart' className='col-2 col-lg-2 walkFormLabel'>Start</label>
                    <div className='col-8 col-lg-8 walkFormInput'>
                        <input type='text' value={this.state.value} onChange={this.handleChange} />
                    </div>
                    <input type='submit' value="Submit"/>
                </div>
            </form>
        )
    }
}

ReactDOM.render( < Application / > , document.getElementById('app'));