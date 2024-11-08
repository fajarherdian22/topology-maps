// MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import './styles.css';
import 'leaflet/dist/leaflet.css';
import icons from './iconHandler'
import { calculateCenter, calculateKPI, categoryKpi, categoryLink } from './calculation';
import Legend from './legend';

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
};

const isValidLevel = (level) => level === "MW" || level === "EN" || level === "CN" || level === "AN" || level === "H3I" || level === "IPBB";
const routerLevel = (level) => { return level === "CN" || level === "AN" || level === "H3I" || level === "IPBB" || level === "EN"}
const siteLevel = (level) => { return level === "MW" || level === "EN" }

const getLevelAttributes = level => {
    switch (level) {
        case "AN":
        case "H3I":
        case "IPBB":
            return { icon: icons("repeater"), dashArray: '5, 5', widthLine: '3' };
        case "CN":
            return { icon: icons("router"), dashArray: '25, 5', widthLine: '4' };
        default:
            return { icon: icons("site"), dashArray: '0', widthLine: '1.5' };
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
            <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />

            {data.map((item, index) => {
                const utilColor = calculateKPI("Util", item.max_util);
                const trafficColorA = calculateKPI("Traffic", Math.round(item.ioh_data_traffic_4g / 1024));
                const trafficColorB = calculateKPI("Traffic", Math.round(item.traffic_origin / 1024));
                
                const categoryKpiA = categoryKpi(trafficColorA)
                const categoryKpiB = categoryKpi(trafficColorB)
                const categoryKpiLink = categoryLink(utilColor)
                
                const pointOrigin = [item.latitude, item.longitude];
                const pointDest = [item.latitude_destination, item.longitude_destination];

                const isValidGeoA = item.longitude && item.latitude
                const isValidGeoB = item.latitude_destination && item.longitude_destination
                
                const isRouterA = routerLevel(item.level_ne_a) && isValidLevel(item.level_ne_a);
                const isRouterB = routerLevel(item.level_ne_b) && isValidLevel(item.level_ne_b);
                
                const isSiteA = siteLevel(item.level_ne_a) && isValidLevel(item.level_ne_a);
                const isSiteB = siteLevel(item.level_ne_b) && isValidLevel(item.level_ne_b);
                
                const attributesA = getLevelAttributes(item.level_ne_a)
                const attributesB = getLevelAttributes(item.level_ne_b)

                const iconSiteA = getSiteColor(trafficColorA)
                const iconSiteB = getSiteColor(trafficColorB)
                return (
                    <React.Fragment>
                        {/* /// Router Layer */}
                        {isValidGeoA && isRouterA && item.level_ne_a !== 'EN' &&(
                            <Marker
                                position={pointOrigin}
                                icon={attributesA.icon}
                            >
                        <Popup>
                            <div className='TitlePopup'>Level</div>
                            <div className='ContentPopup'>{item.level_ne_a}</div>
                            <div className='TitlePopup'>NE Name</div>            
                            <div className='ContentPopup'>{item.ne_a || "No Information"}</div>            
                        </Popup>

                            </Marker>
                        )}
                        {isValidGeoB && isRouterB && item.level_ne_b !== 'EN' && (
                            <Marker
                                position={pointDest}
                                icon={attributesB.icon}
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
                        {isValidGeoA && isValidGeoB && isRouterA && isRouterB && (
                            <Polyline
                                color={utilColor}
                                pathOptions={{
                                    weight: attributesA.widthLine,
                                    dashArray: attributesA.dashArray
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
                                <div className='TitlePopup'>Util Category</div>            
                                <div className='ContentPopup'style={{color:utilColor }}>{categoryKpiLink}</div>
                                </Popup>
                            </Polyline>
                        )}

                        {/* /// Site Markers */}
                        {isValidGeoA && isSiteA && (
                            <Marker
                                position={pointOrigin}
                                icon={iconSiteA.icon}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Level</div>
                                    <div className='ContentPopup'>{item.level_ne_a}</div>
                                    <div className='TitlePopup'>Site ID</div>            
                                    <div className='ContentPopup'>{item.siteid || "No Information"}</div>         
                                    <div className='TitlePopup'>Traffic</div>            
                                    <div className='ContentPopup'>{Math.round(item.ioh_data_traffic_4g / 1024)} (GB)</div>   
                                    <div className='TitlePopup'>Traffic Category</div>            
                                    <div className='ContentPopup'  style={{color:trafficColorA }}>{categoryKpiA}</div>   
                                </Popup>
                            </Marker>
                        )}
                        {isValidGeoB && isSiteB && (
                            <Marker
                                position={pointDest}
                                icon={iconSiteB.icon}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Level</div> 
                                    <div className='ContentPopup'>{item.level_ne_b}</div>
                                    <div className='TitlePopup'>Site ID</div>            
                                    <div className='ContentPopup'>{item.site_destination || "No Information"}</div>         
                                    <div className='TitlePopup'>Traffic</div>            
                                    <div className='ContentPopup'>{Math.round(item.traffic_origin / 1024)} (GB)</div>   
                                    <div className='TitlePopup'>Traffic Category</div>            
                                    <div className='ContentPopup' style={{color: trafficColorB }}>{categoryKpiB}</div>   
                                </Popup>
                            </Marker>
                        )}

                        {/* /// Site Link */}
                        {isValidGeoA && isValidGeoB && isSiteA && isSiteB && (
                            <Polyline
                                color={utilColor}
                                pathOptions={{
                                    weight: attributesA.widthLine,
                                    dashArray: attributesA.dashArray
                                }}
                                positions={[pointOrigin, pointDest]}
                            >
                                <Popup>
                                    <div className='TitlePopup'>Link Site</div>
                                    <div className='ContentPopup'>{item.siteid} - {item.site_destination}</div>
                                    <div className='TitlePopup'>Utilization</div>            
                                    <div className='ContentPopup'>{Math.round(item.max_util)}%</div>
                                    <div className='TitlePopup'>Util Category</div>            
                                    <div className='ContentPopup'  style={{color:utilColor }}>{categoryKpiLink}</div>
                                </Popup>
                            </Polyline>
                        )}
                        </React.Fragment>
                );
            })}

            <RecenterAutomatically lat={center[0]} lng={center[1]} />
            <Legend/>
        </MapContainer>
    );
};



export default MapComponent;