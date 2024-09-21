import React, { useEffect, useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_efm } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { AllButton } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axiosInstance from '../../utils/AxiosInstance';
import { label } from 'three/webgpu';
import { actvColumns, coefColumns, efmColumns, equipActvColumns, equipCoefColumns } from '../../assets/json/tableColumn';


export default function Efm() {

    const [actv, setActv] = useState([]); // 활동자료 리스트
    const [showEfm, setShowEfm] = useState(true);
    const [selectedActv, setSelectedActv] = useState([]); // 선택된 활동자료
    const [selectedActvList, setSelectedActvList] = useState([]); // 선택된 활동자료의 배출계수 리스트..
    const [filteredEfm, setFilteredEfm] = useState([]); // 년도로 필터링된 배출계수
    const [selectedEfm, setSelectedEfm] = useState(null); // 선태고딘 배출계수

    const [isModalOpen, setIsModalOpen] = useState({
        EfmAdd: false,
        EfmEdit: false,
        Delete: false,
    });

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({...prevState, [modalType]: true}));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
        if (modalType === 'EfmAdd') {
            setFilteredEfm(prevList => [...prevList, data]);
        }
        else if (modalType === 'EfmEdit') {
            setFilteredEfm(prevList =>
                prevList.map(item =>
                    item.id === data.id ? { ...item, ...data } : item
                )
            );
        }
        else if (modalType === 'Delete') {
            setFilteredEfm(prevList => prevList.filter(item => item.id !== data.id));
        }
    };
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    }; 

    const handleAddClick = () => {
        showModal('EfmAdd');
    }

    const handleEditClick = () => {
        showModal('EfmEdit');
    }

    const handleDeleteClick = () => {
        showModal('Delete');
    }
    
    const handleFormSubmit = async (e) => {
        setShowEfm(false);
        const {data} = await axiosInstance.get('/equip/actv', {
            params:{
                actvDataName: e.actvDataName
            }
        });
        setActv(data ?? {});
        setShowEfm(true);
        setShowSearchResult(false);
    }

    const [showSearchResult, setShowSearchResult] = useState(false);

    const handleRowClick = async (e) => {
        if (e === undefined){
            setShowSearchResult(false);
        }
        else{
            setSelectedActv(e);
            setShowSearchResult(true);
            const {data} = await axiosInstance.get(`/equip/coef?actvDataId=${e.id}`)
            setSelectedActvList(data ?? {});
            const firstSetFilteredEfm = data.filter((e) => e.applyYear === 2024);
            setFilteredEfm(firstSetFilteredEfm);
            
        }
    }   

    const handleEfmRowClick = (e) => {
        setSelectedEfm(e);
        console.log(e);
    }
    

    const [year, setYear] = useState(2024);
    const handleYearChange = async (year) => {
        setYear(year.target.value);
        const selectedYear = year.target.value
        const yearSelectedActvList= selectedActvList.filter((e) => e.applyYear === selectedYear);
        setFilteredEfm(yearSelectedActvList);
    }
    
    useEffect(() => {
        (async () => {
            const {data} = await axiosInstance.get(`/equip/actv`);
            setActv(data ?? {});
        })();
    },[])

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"현장정보 > 설비 > 배출계수관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_efm}/>
            <div className={sysStyles.main_grid} >
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"93vh", borderRadius:"15px"}}>
                    <TableCustom title="활동자료" columns={equipActvColumns} data={actv} onRowClick={handleRowClick} pagination={true} modalPagination={false}/>
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
                            <TableCustom title="" columns={equipCoefColumns} data={filteredEfm} buttons={["Add", "Edit", "Delete"]} selectedRows={[selectedEfm]} onRowClick={handleEfmRowClick} onClicks={[handleAddClick, handleEditClick, handleDeleteClick]} modals={
                                [
                                    isModalOpen.EfmAdd && {
                                        "modalType" : 'EfmAdd',
                                        'isModalOpen': isModalOpen.EfmAdd,
                                        'handleOk': handleOk('EfmAdd'),
                                        'handleCancel': handleCancel('EfmAdd'),
                                        'rowData': selectedActv,
                                    },
                                    isModalOpen.EfmEdit && {
                                        "modalType" : 'EfmEdit',
                                        'isModalOpen': isModalOpen.EfmEdit,
                                        'handleOk': handleOk('EfmEdit'),
                                        'handleCancel': handleCancel('EfmEdit'),
                                        'rowData': {...selectedEfm,"inputUnitCode" : selectedActv.inputUnitCode, "actvDataId": selectedActv.id},
                                    },
                                    isModalOpen.Delete && {
                                        "modalType" : 'Delete',
                                        'isModalOpen': isModalOpen.Delete,
                                        'handleOk': handleOk('Delete'),
                                        'handleCancel': handleCancel('Delete'),
                                        'rowData': selectedEfm,
                                        'rowDataName': "ghgCode",
                                        'url': '/equip/coef',
                                    },
                                ].filter(Boolean)
                            }/>
                        </Card>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}