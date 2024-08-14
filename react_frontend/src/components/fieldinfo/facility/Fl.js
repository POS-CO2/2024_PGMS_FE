import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css";
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {lib} from "../../../assets/json/selectedPjt";
import {formField_fl} from "../../../assets/json/searchFormData.js";

export default function Fl() {
    const [formData, setFormData] = useState({});                 // 검색 데이터
    const [selectedEqLib, setSelectedEqLib] = useState({});     // 선택된 설비 LIB 목록(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        FlAdd: false,
        FlEdit: false,
        Del: false
    });

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    // 설비LIB row 클릭 시 호출될 함수
    const handleEqLibClick = (lib) => {
        setSelectedEqLib(lib ?? {});
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 설비LIB 등록 버튼 클릭 시 호출될 함수
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
        showModal('FlAdd');
    };

    const onEditClick = () => {
        showModal('FlEdit');
    };

    const onDeleteClick = () => {
        showModal('Del');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 설비 &gt; 설비 LIB 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fl} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(Table 컴포넌트의 data 파라미터)

                <>
                    <TableCustom 
                        title='설비LIB목록' 
                        data={lib}                   
                        buttons={['Delete', 'Edit', 'Add']}
                        onClicks={[onDeleteClick, onEditClick, onAddClick]}
                        onRowClick={(e) => handleEqLibClick(e)}
                        selectedRows={[selectedEqLib.EquipName]}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
                            },
                            {
                                'modalType': 'FlEdit',
                                'isModalOpen': isModalOpen.FlEdit,
                                'handleOk': handleOk('FlEdit'),
                                'handleCancel': handleCancel('FlEdit'),
                                'rowData': selectedEqLib
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