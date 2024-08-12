import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import TableCustom from "../../../TableCustom";
import project from "../../../assets/json/project.js";
import SearchForms from "../../../SearchForms"
import {formField_pg} from "../../../assets/json/searchFormData.js"

export default function Pg() {
    const [formData, setFormData] = useState({});                 // 검색 데이터
    const [selectedPjt, setSelectedPjt] = useState(null);       // 선택된 프로젝트
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (row) => {
        setSelectedPjt(row.PjtCode);   // 클릭된 프로젝트의 코드로 상태를 설정
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
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 프로젝트 관리</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_pg} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <TableCustom 
                        title='프로젝트목록' 
                        data={project} 
                        buttons={['Edit', 'Delete', 'Add']}
                        onRowClick={handlePjtClick}
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