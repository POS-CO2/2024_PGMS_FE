import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_efm } from '../../assets/json/searchFormData';
import { table_efm_list } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';
import { AllButton } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import { Card } from '@mui/material';


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
            <div className={sysStyles.main_grid}>
                {showSearchResult ? (
                    <Card className={sysStyles.card_box} sx={{width:"100%", height:"100vh"}}>
                        <TableCustom title="배출계수목록" data={table_efm_list} button="AllButton" onRowClick={handleRowClick} />
                    </Card>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}