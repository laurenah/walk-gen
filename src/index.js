// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibGF1cmVuYWgiLCJhIjoiY2tjZW5oMjF2MGExejMzcWtkYnFyeHI1MyJ9.5lpcvu4s0ArEKQlnhtbxnA';

class Application extends React.Component {
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
                    lng: position.coords.longitude,
                    lat: position.coords.latitude,
                    zoom: this.state.zoom
                });

                map.center = [this.state.lng, this.state.lat];
                console.log(map.center);
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
                <div  className="latlngBox">
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat}</div>
                </div>
                <div ref={el => this.mapContainer = el} className="mapContainer" />
            </div>
        )
    }
}

ReactDOM.render( < Application / > , document.getElementById('app'));