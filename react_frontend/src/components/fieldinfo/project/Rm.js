import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import {pjt, saleAmt} from "../../../assets/json/selectedPjt";
import managers from "../../../assets/json/manager";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData.js";

export default function Rm() {
    const [showResults, setShowResults] = useState(false);            // 조회결과와 담당자목록을 표시할지 여부
    const [selectedPjt, setSelectedPjt] = useState(null);             // 선택된 프로젝트 코드
    const [selectedSM, setSelectedSM] = useState([]);                 // 선택된 매출액

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleFormSubmit = (data) => {
        
    };

    // 조회 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (row) => {
        setSelectedPjt(row.PjtCode);   // 클릭된 프로젝트의 코드로 상태를 설정
    };

    // 매출액 row 클릭 시 호출될 함수
    const handleSMClick = (row) => {
        setSelectedSM(row.year);
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
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 매출액 관리</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0], formField_ps12[1]]} onSearch={handleSearch} />
            
            {/* showResults 상태가 true일 때만 결과를 표시 */}
            {showResults && (
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={pjt} onRowClick={handlePjtClick} />

                    <TableCustom 
                        title='매출액목록' 
                        data={saleAmt} 
                        buttons={['Edit', 'Delete', 'Add']}
                        onRowClick={handleSMClick}
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