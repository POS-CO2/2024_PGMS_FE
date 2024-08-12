import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import TableCustom from "../../../TableCustom";
import {actv} from "../../../assets/json/selectedPjt";
import SearchForms from "../../../SearchForms";
import {formField_fam} from "../../../assets/json/searchFormData.js";

export default function Fam() {
    const [showResults, setShowResults] = useState(false);      // 조회결과와 담당자목록을 표시할지 여부
    const [selectedActv, setSelectedActv] = useState(null);       // 선택된 설비 LIB

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleFormSubmit = (data) => {
        
    };

    // 조회 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);
    };

    // 활동자료 목록 row 클릭 시 호출될 함수
    const handleActvClick = (row) => {
        setSelectedActv(row.ActvDataName);
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
            <div className={tableStyles.menu}>현장정보 &gt; 설비 &gt; 활동자료 관리</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fam} onSearch={handleSearch} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <TableCustom 
                        title='활동자료목록' 
                        data={actv} 
                        buttons={['Edit', 'Delete', 'Add']}
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