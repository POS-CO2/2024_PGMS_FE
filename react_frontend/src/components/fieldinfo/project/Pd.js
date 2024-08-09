import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import project from "../../../assets/json/selectedPjt";
import managers from "../../../assets/json/manager";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData.js";

export default function Pd() {
    const [searchedPjt, setSearchedPjt] = useState(null);             // 프로젝트 찾기 결과(api 연동해서 받아올 data)
    const [formData, setFormData] = useState({});                     // 검색 데이터
    const [searchResult, setsearchResult] = useState(null);           // 프로젝트 조회 결과(api 연동해서 받아올 data)
    const [selectedManagers, setSelectedManagers] = useState([]);     // 선택된 담당자들(PK column only)

    const [isModalOpen, setIsModalOpen] = useState({
        PdAdd: false,
        PdDel: false
    });

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (row) => {
        setSelectedPjt(row.PjtCode);   // 클릭된 프로젝트의 코드로 상태를 설정
    };

    // 담당자 row 클릭 시 호출될 함수
    const handleManagerClick = (manager) => {
        setSelectedManagers([...selectedManagers, manager.loginId]);
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    // modalType에 따라 결과 처리 해주기
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
        showModal('PdAdd');
    };
    const onDeleteClick = () => {
        //showModal('PdDelete');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0]]} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={project} />                    

                    <TableCustom 
                        title='담당자목록' 
                        variant='checkbox'
                        data={managers}                   
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handleManagerClick}
                        modals={[
                            {
                                'modalType': 'PdDel',
                                'isModalOpen': isModalOpen.PdDel,
                                'handleOk': handleOk('PdDel'),
                                'handleCancel': handleCancel('PdDel')
                            },
                            {
                                'modalType': 'PdAdd',
                                'isModalOpen': isModalOpen.PdAdd,
                                'handleOk': handleOk('PdAdd'),
                                'handleCancel': handleCancel('PdAdd')
                            }
                        ]}
                    />
                </>
            )}
        </>
    );
}