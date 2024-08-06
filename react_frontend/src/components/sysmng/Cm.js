import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import * as tableStyles from '../../assets/css/table.css'
import { formField_cm } from '../../assets/json/searchFormData';

export default function Cm() {
    const [codeGroup, setCodeGroup] = useState([]);

    const handleFormSubmit = (data) => {
        setCodeGroup(data);
    }


    return (
        <>
            <div>
                {"시스템관리 > 코드 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_cm}/>
        </>
    );
}