import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_efm } from '../../assets/json/searchFormData';
import { table_efm_list, table_fm_res } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';
import { AllButton } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


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

    const [year, setYear] = useState(2024);

    const handleYearChange = (year) => {
        setYear(year.target.value)
    }

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"현장정보 > 설비 > 배출계수관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_efm} onSearch={handleSearchClick}/>
            <div className={sysStyles.main_grid_fm} >
                {showSearchResult ? (
                    <>
                        <Card className={sysStyles.card_box} sx={{width:"100%", height:"fit-content", borderRadius:"15px"}}>
                            <div className={sysStyles.mid_title}>
                                {"활동자료"}
                            </div>
                            <TableCustom title="" data={table_fm_res} onRowClick={handleRowClick}/>
                        </Card>
                        
                        <Card className={sysStyles.card_box} sx={{width:"100%", height:"fit-content", borderRadius:"15px"}}>
                            <div className={sysStyles.mid_title}>
                                {"배출계수목록"}
                            </div>
                            <FormControl sx={{marginLeft:"3%", marginBottom:"-2%"}}>
                            <InputLabel id="demo-simple-select-label">년도</InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={year}
                                label="year"
                                onChange={handleYearChange}
                                sx={{width:"12%", height:"2rem"}}
                            >
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2022}>2022</MenuItem>
                                <MenuItem value={2021}>2021</MenuItem>
                            </Select>
                            </FormControl>
                            <TableCustom title="" data={table_efm_list} button="AllButton" onRowClick={handleRowClick} />
                        </Card>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}