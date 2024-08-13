import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import {actv, lib} from "../../../assets/json/selectedPjt";
import SearchForms from "../../../SearchForms";
import {formField_fad} from "../../../assets/json/searchFormData.js";

export default function Fad() {
    const [showResults, setShowResults] = useState(false);            // 조회결과와 담당자목록을 표시할지 여부
    const [selectedLib, setSelectedLib] = useState(null);             // 선택된 설비 LIB
    const [selectedActve, setSelectedActve] = useState(null);         // 선택된 활동자료

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleFormSubmit = (data) => {
        
    };

    // 조회 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);
    };

    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (row) => {
        setSelectedActve(row.UserId);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (data) => {
        setIsModalOpen(false);
        setInputValue(data);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    }; 

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fad} onSearch={handleSearch} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={lib} onRowClick={selectedLib} />

                    <TableCustom 
                        title='활동자료목록' 
                        data={actv} 
                        buttons={['Delete', 'Add']}
                        onRowClick={handleActvClick}
                        modal={{
                            'modalType': 'PD',
                            'buttonClick': showModal,
                            'isModalOpen': isModalOpen,
                            'handleOk': handleOk,
                            'handleCancel': handleCancel
                        }}
                    />
                </>
            )}
        </>
    );
}