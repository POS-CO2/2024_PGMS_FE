import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_efm } from '../../assets/json/searchFormData';
import { table_efm_list } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';
import { AllButton } from '../../Button';


export default function Efm() {

    const [efm, setEfm] = useState([]);

    const handleFormSubmit = (data) => {
        setEfm(data);
    }

    const [showSearchResult, setShowSearchResult] = useState(showSearchResult ? true : false);

    const handleSearchClick = () => {
        setShowSearchResult(!showSearchResult);
        console.log(showSearchResult);
    }

    const handleRowClick = () => {

    }

    return (
        <>
            <div>
                {"현장정보 > 설비 > 배출계수관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_efm} onSearch={handleSearchClick}/>
            {showSearchResult ? (
                <TableCustom title="배출계수목록" data={table_efm_list} button="AllButton" onRowClick={handleRowClick} />
            ) : (
                <></>
            )}
        </>
    );
}