import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {actv} from "../../../assets/json/selectedPjt";
import {formField_fam} from "../../../assets/json/searchFormData.js";

export default function Fam() {
    const [formData, setFormData] = useState({});                 // 검색 데이터
    const [selectedActves, setSelectedActves] = useState([]);     // 선택된 설비 LIB 목록(PK column only)

    const [isModalOpen, setIsModalOpen] = useState({
        FamAdd: false,
        Del: false
    });

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (actv) => {
        setSelectedActv(actv?.actvDataName ?? null);
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 활동자료 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        //setInputValue(data);
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 버튼 클릭 시 모달 열림 설정 - showModal(modalType);
    const onAddClick = () => {
        showModal('FamAdd');
    };

    const onDeleteClick = () => {
        showModal('Del');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 설비 &gt; 활동자료 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fam} />

            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <TableCustom 
                        title='활동자료목록' 
                        variant='checkbox'
                        data={actv}                   
                        buttons={['Edit', 'Delete', 'Add']}
                        onClicks={[()=>{}, onDeleteClick, onAddClick]}
                        onRowClick={handleActvClick}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
                            },
                            {
                                'modalType': 'FamAdd',
                                'isModalOpen': isModalOpen.FamAdd,
                                'handleOk': handleOk('FamAdd'),
                                'handleCancel': handleCancel('FamAdd')
                            }
                        ]}
                    />
                </>
            )}
        </>
    );
}