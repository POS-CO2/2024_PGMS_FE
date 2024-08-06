import React, { useState } from 'react';
import SearchForms from "../../SearchForms.js";
import {formField_ps12} from "../../assets/json/searchFormData.js"

export default function Ps_1_2() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <h2>실적스코프1,2</h2>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12}/>
            <div>
                <h3>Form Data:</h3>
                <ul>
                    {Object.entries(formData).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value ? value.toString() : ''}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}