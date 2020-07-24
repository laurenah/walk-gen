// Imports
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import config from './mapbox-key';
import {Map} from './components/Map';

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

ReactDOM.render( < Application / > , document.getElementById('app'));