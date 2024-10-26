import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import SelectBox from '../TopSection/Selectbox';
import './styles.css';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
}

const CenterMap = (data) => {
    if (data.length > 0) {
        const sumLat = data.reduce((sum, coord) => sum + coord.ran_site_latitude, 0);
        const sumLon = data.reduce((sum, coord) => sum + coord.ran_site_longitude, 0);
        const avgLat = sumLat / data.length;
        const avgLon = sumLon / data.length;
        return [avgLat, avgLon];
    }
    return [0, 0];
}

const MapComponent = () => {
    const [datas, setData] = useState([]);
    const [selectedCity, setCity] = useState("Jakarta Selatan");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [centralPos, setCentralPos] = useState([-6.1679, 106.759]);

    const getData = async (city) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/data/city', {
                date: '2024-10-21',
                city: city
            });
            const data = response.data.data;
            setData(data);

            const [avgLat, avgLon] = CenterMap(data);
            setCentralPos([avgLat, avgLon]);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getData(selectedCity);
        };
        fetchData();
    }, [selectedCity]);

    return (
        <div>
            <SelectBox onChange={(option) => setCity(option.value)} />
            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            {console.log(centralPos)}
            <MapContainer
                className='maps'
                center={centralPos}
                zoom={13}
                scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {datas
                    .filter(data => data.ran_site_latitude != null && data.ran_site_longitude != null)
                    .map((data, index) => (
                        <Marker key={index} position={[data.ran_site_latitude, data.ran_site_longitude]} icon={icon}>
                            <Popup>{data.siteid}</Popup>
                        </Marker>
                    ))}

                {datas
                    .filter(data => data.latitude_destination != null && data.longitude_destination != null)
                    .map((data, index) => (
                        <Marker key={index} position={[data.latitude_destination, data.longitude_destination]} icon={icon}>
                            <Popup>site destination: {data.site_destination}</Popup>
                        </Marker>
                    ))}

                {datas
                    .filter(data =>
                        data.ran_site_latitude != null &&
                        data.ran_site_longitude != null &&
                        data.latitude_destination != null &&
                        data.longitude_destination != null
                    )
                    .map((data) => (
                        <Polyline
                            key={data.siteid}
                            positions={[
                                [data.ran_site_latitude, data.ran_site_longitude],
                                [data.latitude_destination, data.longitude_destination],
                            ]}
                            color={'red'}
                        />
                    ))}


                <RecenterAutomatically lat={centralPos[0]} lng={centralPos[1]} />
            </MapContainer>

        </div>
    );
}

export default MapComponent;
