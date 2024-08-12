import React, { useState } from 'react';
import SearchForms from '../../../SearchForms';
import { formField_fm } from '../../../assets/json/searchFormData';
import { table_fm_facList, table_fm_res } from '../../../assets/json/selectedPjt';
import TableCustom from '../../../TableCustom';
import { AllButton } from '../../../Button';
import * as sysStyles from '../../../assets/css/sysmng.css';
import * as mainStyle from '../../../assets/css/main.css';
import { Card } from '@mui/material';

export default function Fm() {

    const [fac, setFac] = useState([]);

    const handleFormSubmit = (data) => {
        setFac(data);
    };

    const [showSearchResult, setShowSearchResult] = useState(false);

    const handleSearchClick = () => {
        setShowSearchResult(true);
    };

    const [showFacList, setShowFacList] = useState(false);

    const handleRowClick = () => {
        setShowFacList(false);
    };

    const [isModalOpen, setIsModalOpen] = useState({
        FmAdd: false,
        Delete: false
    });

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({...prevState, [modalType]: true}));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    }; 

    const handleExcelUploadClick = (csvData, fileName) => {
        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성
        const headers = Object.keys(csvData[0]);
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        // CSV 파일 생성
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleAddClick = () => {
        showModal('FmAdd');
    }

    const handleDeleteClick = () => {
        showModal('Delete');
    }

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"현장정보 > 설비 > 설비지정"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fm} onSearch={handleSearchClick}/>
            <div className={sysStyles.main_grid_fm}>
            
                {showSearchResult ? (
                    <>  
                        <Card className={sysStyles.card_box} sx={{width:"100%", height:"fit-content"}}>
                            <TableCustom title="조회결과" data={table_fm_res} onRowClick={handleRowClick}/>
                        </Card>
                        {/** 버튼 변경 필요(엑셀 다운로드, 삭제, 등록) 및 등록 클릭 시 모달 추가 */}
                        <Card className={sysStyles.card_box} sx={{width:"100%", height:"fit-content"}}>
                        <TableCustom title="설비목록" data={table_fm_facList} buttons={["DownloadExcel", "Delete", "Add"]} onClicks={[() => handleExcelUploadClick(table_fm_facList, 'exported_table'), handleDeleteClick,handleAddClick]} onRowClick={handleRowClick} excel={true} modals={
                            [
                                {
                                    "modalType" : 'FmAdd',
                                    'isModalOpen': isModalOpen.FmAdd,
                                    'handleOk': handleOk('FmAdd'),
                                    'handleCancel': handleCancel('FmAdd')
                                },
                                {
                                    "modalType" : 'Delete',
                                    'isModalOpen': isModalOpen.Delete,
                                    'handleOk': handleOk('Delete'),
                                    'handleCancel': handleCancel('Delete')
                                },
                            ]
                        }/>
                        </Card>
                    </>
                ):(
                    <></>
                )}
            </div>
        </>
    );
}