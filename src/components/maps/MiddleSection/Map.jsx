// MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import './styles.css';
import 'leaflet/dist/leaflet.css';
import icons from './iconHandler'
import { calculateCenter, calculateKPI } from './calculation';
// import FullscreenControl from "react-leaflet-fullscreen";
// import 'leaflet.fullscreen/Control.FullScreen.css'

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
};

const isValidLevel = (level) => level === "MW" || level === "EN" || level === "CN" || level === "AN" || level === "H3I" || level === "IPBB";

const routerLevel = (level) => {
    return level === "CN" || level === "AN" || level === "H3I" || level === "IPBB"
}

const siteLevel = (level) => {
    return level === "MW" || level === "EN"
}

const getLevelAttributes = (level) => {
    if (level === "AN" || level === "H3I" || level === "IPBB") {
        return {
            icon: icons("repeater"),
            dashArray: '5, 5',
            widthLine: '3'
        };
    } else if (level === "CN") {
        return {
            icon: icons("router"),
            dashArray: '25, 5',
            widthLine: '4'
        };
    } else {
        return {
            icon: icons("site"),
            dashArray: '0',
            widthLine: '1.5'
        };
    }
};


const MapComponent = ({ data }) => {
    const center = calculateCenter(data);
    return (
        <MapContainer className="maps" center={center} zoom={12} scrollWheelZoom={true}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((item, index) => (
                item.longitude && item.latitude && isValidLevel(item.level_ne_a) && isValidLevel(item.level_ne_b) && (
                    <Marker
                        key={`marker-site-${index}`}
                        position={[item.latitude, item.longitude]}
                        icon={getLevelAttributes(item.level_ne_a).icon}
                    >
                        <Popup>
                            {routerLevel(item.level_ne_a) ? item.ne_a : siteLevel(item.level_ne_a) ? item.site_id : null}
                        </Popup>

                    </Marker>
                )
            ))}

            {data.map((item, index) => (
                item.latitude_destination && item.longitude_destination && isValidLevel(item.level_ne_a) && isValidLevel(item.level_ne_b) && (
                    <Marker
                        key={`marker-destination-${index}`}
                        position={[item.latitude_destination, item.longitude_destination]}
                        icon={getLevelAttributes(item.level_ne_b).icon}
                    >
                        <Popup>
                            {routerLevel(item.level_ne_b) ? item.ne_b : siteLevel(item.level_ne_b) ? item.site_destination : null}
                        </Popup>
                    </Marker>
                )
            ))}

            {data.map((item, index) => (
                item.latitude && item.longitude && item.latitude_destination && item.longitude_destination && isValidLevel(item.level_ne_a) && isValidLevel(item.level_ne_b) && (
                    <Polyline

                        color={calculateKPI("Util", item.max_util)}
                        key={`polyline-${index}`}
                        pathOptions={{ weight: getLevelAttributes(item.level_ne_a).widthLine, dashArray: getLevelAttributes(item.level_ne_a).dashArray }}
                        positions={[
                            [item.latitude, item.longitude],
                            [item.latitude_destination, item.longitude_destination],
                        ]}>
                        <Popup>
                            <center>
                                Link Router
                                <br />
                                {item.ne_a} - {item.ne_b}
                                <br />
                                Link Site
                                <br />
                                {item.siteid} - {item.site_destination}
                                <br />
                                Util
                                <br />
                                {Math.round(item.max_util)}(%)
                            </center>
                        </Popup>
                    </Polyline>

                )
            ))}
            <RecenterAutomatically lat={center[0]} lng={center[1]} />
        </MapContainer>
    );
};


export default MapComponent;