import React, { useState } from 'react';
import SelectBox from './TopSection/Selectbox'
import MapComponent from './MiddleSection/Map'

const ParentComponent = () => {
    const [data, setData] = useState([]);

    const handleCityChange = (cityData, selectedCity) => {
        setData(cityData);
    };

    return (
        <div>
            <SelectBox onCityChange={handleCityChange} />
            <MapComponent data={data} />
        </div>
    );
};

export default ParentComponent;
