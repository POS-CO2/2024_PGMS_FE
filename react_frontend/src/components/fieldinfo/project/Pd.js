import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import project from "../../../assets/json/selectedPjt";
import managers from "../../../assets/json/manager";
import SearchForms from "../../../SearchForms"
import {formField_ps12} from "../../../assets/json/searchFormData.js"

export default function Pd() {
    const [showResults, setShowResults] = useState(false);            // 조회결과와 담당자목록을 표시할지 여부
    const [selectedPjt, setSelectedPjt] = useState(null);             // 선택된 프로젝트 코드
    const [selectedManager, setSelectedManager] = useState([]);       // 선택된 매니저
    const [formData, setFormData] = useState({});
    const [searchResult, setSearchResult] = useState('');

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

    // 담당자 row 클릭 시 호출될 함수
    const handleManagerClick = (row) => {
        setSelectedManager(row.UserId);
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
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0]]} onSearch={handleSearch} />
            
            {/* showResults 상태가 true일 때만 결과를 표시 */}
            {showResults && (
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={project} onRowClick={handlePjtClick} />

                    {/* 선택된 프로젝트가 있을 때만 담당자 목록을 표시 */}
                    {selectedPjt && (
                        <TableCustom 
                            title='담당자목록' 
                            data={managers} 
                            button='AddAndDeleteButton' 
                            onRowClick={handleManagerClick}
                            modal={{
                                'buttonClick': showModal,
                                'isModalOpen': isModalOpen,
                                'handleOk': handleOk,
                                'handleCancel': handleCancel
                            }}
                        />
                    )}
                </>
            )}
        </>
    );
}