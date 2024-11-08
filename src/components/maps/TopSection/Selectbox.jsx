// SelectBox.jsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './styles.css';
import { Level } from './options';
import TitlePage from './Title';

const SelectBox = ({ onCityChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCities = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.1.6:8080/api/data/list/city');
            const formattedOptions = response.data.data.map(city => ({
                value: city,
                label: city,
            }));
            setOptions(formattedOptions);
        } catch (error) {
            setError("Failed to load cities.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCityData = async (city) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.1.6:8080/api/data/city', {
                city,
            });
            onCityChange(response.data.data, city);
            
        } catch (error) {
            setError("Failed to fetch city data.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
        fetchCityData("KOTA TASIKMALAYA");
    }, []);

    const handleChange = (option) => {
        fetchCityData(option.value);
    };

    return (

        <div className='container'>
            <div className='selectBox-container'>
            <div className='titleFilter'>Level</div>
            <div className='titleFilter'>Select Filter</div>
            <div>
                <Select
                    className='selectBox'
                    options={Level}
                    defaultValue={{ value: "City", label: "City" }}
                />
            </div>
            <div>
                <Select
                    className="selectBox"
                    onChange={handleChange}
                    label="Select Filter"
                    options={options}
                    isLoading={loading}
                    defaultValue={{ value: "KOTA TASIKMALAYA", label: "KOTA TASIKMALAYA" }}  // Set default selection
                />
                </div>
                {error && <div className="error">{error}</div>}
            </div>
        </div>

    );
};

export default SelectBox;
