import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import {TableCustomDoubleClickEdit} from "../../../TableCustom";
import project from "../../../assets/json/project.js";
import SearchForms from "../../../SearchForms"
import {formField_pg} from "../../../assets/json/searchFormData.js"

export default function Pg() {
    const [formData, setFormData] = useState({});           // 검색 데이터
    const [selectedPjt, setSelectedPjt] = useState(null);     // 선택된 설비 LIB 목록(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        PgAdd: false,
        Del: false
    });

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (pjt) => {
        setSelectedPjt(pjt?.PjtCode ?? null);
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 프로젝트 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        //setInputValue(data);
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 버튼 클릭 시 모달 열림 설정
    const onAddClick = () => {
        showModal('PgAdd');
    };

    const onDeleteClick = () => {
        showModal('Del');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 프로젝트 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_pg} />
    
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(Table 컴포넌트의 data 파라미터)
                <>
                    <TableCustomDoubleClickEdit 
                        title='프로젝트목록' 
                        data={project}                   
                        buttons={['Edit', 'Delete', 'Add']}
                        onClicks={[()=>{}, onDeleteClick, onAddClick]}
                        onRowClick={handlePjtClick}
                        selectedRows={selectedPjt === null ? [] : [selectedPjt]}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
                            },
                            {
                                'modalType': 'FlAdd',
                                'isModalOpen': isModalOpen.FlAdd,
                                'handleOk': handleOk('FlAdd'),
                                'handleCancel': handleCancel('FlAdd')
                            }
                        ]}
                    />
                </>
            )}
        </>
    );
}