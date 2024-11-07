// MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import './styles.css';
import 'leaflet/dist/leaflet.css';
import icons from './iconHandler'
import { calculateCenter, calculateKPI } from './calculation';
import { icon } from 'leaflet';

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
};

const isValidLevel = (level) => level === "MW" || level === "EN" || level === "CN" || level === "AN" || level === "H3I" || level === "IPBB";
const routerLevel = (level) => { return level === "CN" || level === "AN" || level === "H3I" || level === "IPBB" || "EN"}
const siteLevel = (level) => { return level === "MW" || level === "EN" }

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

const getSiteColor = (color) => {
        return {
            icon: icons(color),
            dashArray: '0',
            widthLine: '1.5'
        };
}



const MapComponent = ({ data }) => {
    const center = calculateCenter(data);

    return (
        <MapContainer className="maps" center={center} zoom={12} scrollWheelZoom={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {data.map((item, index) => {
                const utilColor = calculateKPI("Util", item.max_util);
                const trafficColorA = calculateKPI("Traffic", Math.round(item.ioh_data_traffic_4g / 1024));
                const trafficColorB = calculateKPI("Traffic", Math.round(item.traffic_origin / 1024));

                const pointOrigin = [item.latitude, item.longitude];
                const pointDest = [item.latitude_destination, item.longitude_destination];
                const isRouterA = routerLevel(item.level_ne_a) && isValidLevel(item.level_ne_a);
                const isRouterB = routerLevel(item.level_ne_b) && isValidLevel(item.level_ne_b);
                const isSiteA = siteLevel(item.level_ne_a) && isValidLevel(item.level_ne_a);
                const isSiteB = siteLevel(item.level_ne_b) && isValidLevel(item.level_ne_b);

                return (
                    <>
                        {/* /// Router Layer */}
                        {item.longitude && item.latitude && isRouterA && (
                            <Marker
                                position={pointOrigin}
                                icon={getLevelAttributes(item.level_ne_a).icon}
                            >
                        <Popup>
                            <div className='TitlePopup'>Level</div>
                            <div className='ContentPopup'>{item.level_ne_a}</div>
                            <div className='TitlePopup'>NE Name</div>            
                            <div className='ContentPopup'>{item.ne_a || "No Information"}</div>            
                        </Popup>

                            </Marker>
                        )}
                        {item.latitude_destination && item.longitude_destination && isRouterB && (
                            <Marker
                                position={pointDest}
                                icon={getLevelAttributes(item.level_ne_b).icon}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Level</div>
                                    <div className='ContentPopup'>{item.level_ne_b}</div>
                                    <div className='TitlePopup'>NE Name</div>            
                                    <div className='ContentPopup'>{item.ne_b || "No Information"}</div>
                                </Popup>
                            </Marker>
                        )}

                        {/* /// Router Link */}
                        {item.latitude && item.longitude && item.latitude_destination && item.longitude_destination && isRouterA && isRouterB && (
                            <Polyline
                                color={utilColor}
                                pathOptions={{
                                    weight: getLevelAttributes(item.level_ne_a).widthLine,
                                    dashArray: getLevelAttributes(item.level_ne_a).dashArray
                                }}
                                positions={[pointOrigin, pointDest]}
                            >
                                <Popup>
                                <div className='TitlePopup'>Link Router</div>
                                <div className='ContentPopup'>{item.ne_a} - {item.ne_b}</div>
                                <div className='TitlePopup'>Utilization</div>            
                                <div className='ContentPopup'>{Math.round(item.max_util)}%</div>
                                <div className='TitlePopup'>Bandwith</div>            
                                <div className='ContentPopup'>{Math.round(item.bandwith)} (GB)</div>
                                </Popup>
                            </Polyline>
                        )}

                        {/* /// Site Markers */}
                        {item.longitude && item.latitude && isSiteA && (
                            <Marker
                                position={pointOrigin}
                                icon={getSiteColor(trafficColorA).icon}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Level</div>
                                    <div className='ContentPopup'>{item.level_ne_a}</div>
                                    <div className='TitlePopup'>Site ID</div>            
                                    <div className='ContentPopup'>{item.siteid || "No Information"}</div>         
                                    <div className='TitlePopup'>Traffic</div>            
                                    <div className='ContentPopup'>{Math.round(item.ioh_data_traffic_4g / 1024)} (GB)</div>   
                                </Popup>
                            </Marker>
                        )}
                        {item.latitude_destination && item.longitude_destination && isSiteB && (
                            <Marker
                                position={pointDest}
                                icon={getSiteColor(trafficColorB).icon}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Level</div> 
                                    <div className='ContentPopup'>{item.level_ne_b}</div>
                                    <div className='TitlePopup'>Site ID</div>            
                                    <div className='ContentPopup'>{item.site_destination || "No Information"}</div>         
                                    <div className='TitlePopup'>Traffic</div>            
                                    <div className='ContentPopup'>{Math.round(item.traffic_origin / 1024)} (GB)</div>   
                                </Popup>
                            </Marker>
                        )}

                        {/* /// Site Link */}
                        {item.latitude && item.longitude && item.latitude_destination && item.longitude_destination && isSiteA && isSiteB && (
                            <Polyline
                                color={utilColor}
                                pathOptions={{
                                    weight: getLevelAttributes(item.level_ne_a).widthLine,
                                    dashArray: getLevelAttributes(item.level_ne_a).dashArray
                                }}
                                positions={[pointOrigin, pointDest]}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Link Site</div>
                                    <div className='ContentPopup'>{item.siteid} - {item.site_destination}</div>
                                    <div className='TitlePopup'>Utilization</div>            
                                    <div className='ContentPopup'>{Math.round(item.max_util)}%</div>
                                </Popup>
                            </Polyline>
                        )}
                        </>
                );
            })}

            <RecenterAutomatically lat={center[0]} lng={center[1]} />
        </MapContainer>
    );
};



export default MapComponent;