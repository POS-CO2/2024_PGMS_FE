import React, { useEffect, useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_efm } from '../../assets/json/searchFormData';
import { table_efm_list, table_fm_res } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';
import { AllButton } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axiosInstance from '../../utils/AxiosInstance';
import { label } from 'three/webgpu';
import { actvColumns, coefColumns, efmColumns, equipActvColumns, equipCoefColumns } from '../../assets/json/tableColumn';


export default function Efm() {

    const [efm, setEfm] = useState([]);
    const [showEfm, setShowEfm] = useState(true);
    const [selectedEfm, setSelectedEfm] = useState([]);
    const [filteredEfm, setFilteredEfm] = useState([]);
    
    const handleFormSubmit = async (e) => {
        setShowEfm(false);
        const {data} = await axiosInstance.get('/equip/actv', {
            params:{
                actvDataName: e.actvDataName
            }
        });
        setEfm(data ?? {});
        setShowEfm(true);
        setShowSearchResult(false);
    }

    const [showSearchResult, setShowSearchResult] = useState(false);

    const handleRowClick = async (e) => {
        if (e === undefined){
            setShowSearchResult(false);
        }
        else{
            setShowSearchResult(true);
            const {data} = await axiosInstance.get(`/equip/coef?actvDataId=${e.id}`)
            setSelectedEfm(data ?? {});
            const firstSetFilteredEfm = data.filter((e) => e.applyYear === 2024);
            setFilteredEfm(firstSetFilteredEfm);
        }
        
    }   
    

    const [year, setYear] = useState(2024);
    const handleYearChange = async (year) => {
        setYear(year.target.value);
        const selectedYear = year.target.value
        const yearSelectedEfm = selectedEfm.filter((e) => e.applyYear === selectedYear);
        setFilteredEfm(yearSelectedEfm);
    }
    useEffect(() => {
        (async () => {
            const {data} = await axiosInstance.get(`/equip/actv`);
            setEfm(data ?? {});
        })();
    },[])
    console.log(efm);
    console.log(filteredEfm);

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"현장정보 > 설비 > 배출계수관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_efm}/>
            <div className={sysStyles.main_grid} >
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"75vh", borderRadius:"15px"}}>
                    {/* <div className={sysStyles.mid_title}>
                        {"활동자료"}
                    </div> */}
                    <TableCustom title="활동자료" columns={equipActvColumns} data={efm} onRowClick={handleRowClick}/>
                </Card>
                {showSearchResult ? (
                    <>
                        
                        
                        <Card className={sysStyles.card_box} sx={{width:"50%", height:"75vh", borderRadius:"15px"}}>
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
                                sx={{width:"20%", height:"2rem"}}
                            >
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2022}>2022</MenuItem>
                                <MenuItem value={2021}>2021</MenuItem>
                            </Select>
                            </FormControl>
                            <TableCustom title="" columns={equipCoefColumns} data={filteredEfm} button="AllButton" />
                        </Card>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}