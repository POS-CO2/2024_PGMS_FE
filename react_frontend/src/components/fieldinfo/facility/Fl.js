import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import TableCustom from "../../../TableCustom";
import {lib} from "../../../assets/json/selectedPjt";
import SearchForms from "../../../SearchForms";
import {formField_fl} from "../../../assets/json/searchFormData.js";

export default function Fl() {
    const [showResults, setShowResults] = useState(false);      // 조회결과와 담당자목록을 표시할지 여부
    const [selectedLib, setSelectedLib] = useState(null);       // 선택된 설비 LIB

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleFormSubmit = (data) => {
        
    };

    // 조회 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);
    };

    // 설비 LIB row 클릭 시 호출될 함수
    const handleLibClick = (row) => {
        setSelectedLib(row.EquipName);   // 클릭된 프로젝트의 코드로 상태를 설정
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    // 모달 저장 버튼 눌렀을 때 호출될 함수
    const handleOk = (data) => {
        setIsModalOpen(false);
        setInputValue(data);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    }; 

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 설비 &gt; 설비 LIB 관리</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fl} onSearch={handleSearch} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <TableCustom 
                        title='설비 LIB 목록' 
                        data={lib} 
                        buttons={['Edit', 'Delete', 'Add']}
                        onRowClick={handleLibClick}
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