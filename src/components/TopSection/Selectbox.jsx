import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const SelectBox = ({ onChange }) => {
    const [options, setOptions] = useState([]);

    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/data/list/city');
            const data = response.data.data;
            const formattedOptions = data.map(city => ({
                value: city,
                label: city
            }));
            setOptions(formattedOptions);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Select className='selectBox'
            onChange={onChange}
            options={options}
        />
    );
};

export default SelectBox;
