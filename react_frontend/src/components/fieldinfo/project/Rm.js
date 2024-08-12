import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import {pjt, saleAmt} from "../../../assets/json/selectedPjt";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData.js";

export default function Rm() {
    const [searchedPjt, setSearchedPjt] = useState(null);             // 프로젝트 찾기 결과(api 연동해서 받아올 data)
    const [formData, setFormData] = useState({});                     // 검색 데이터
    const [searchResult, setsearchResult] = useState(null);           // 프로젝트 조회 결과(api 연동해서 받아올 data)
    const [selectedSAs, setSelectedSAs] = useState([]);   

    const [isModalOpen, setIsModalOpen] = useState({
        RmAdd: false,
        Del: false
    });

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    // 매출액 row 클릭 시 호출될 함수
    const handleSAClick = (saleAmt) => {
        setSelectedSAs((prevSelectedSA) => {
            // 선택된 사원의 loginId가 이미 배열에 존재하는지 확인
            if (prevSelectedSA.includes(saleAmt.saleAmt)) {
                // 존재한다면 배열에서 제거
                return prevSelectedSA.filter((id) => id !== saleAmt.saleAmt);
            } else {
                // 존재하지 않는다면 배열에 추가
                return [...selectedSAs, saleAmt.saleAmt];
            }
        });
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    // modalType에 따라 결과 처리 해주기
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 버튼 클릭 시 모달 열림 설정 - showModal(modalType);
    const onAddClick = () => {
        showModal('RmAdd');
    };
    const onDeleteClick = () => {
        showModal('Del');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 매출액 관리</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0]]} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={pjt} />                    

                    <TableCustom 
                        title='매출액목록' 
                        variant='checkbox'
                        data={saleAmt}                   
                        buttons={['Edit', 'Delete', 'Add']}
                        onClicks={[() => {}, onDeleteClick, onAddClick]}
                        onRowClick={handleSAClick}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
                            },
                            {
                                'modalType': 'RmAdd',
                                'isModalOpen': isModalOpen.RmAdd,
                                'handleOk': handleOk('RmAdd'),
                                'handleCancel': handleCancel('RmAdd')
                            },
                        ]}
                    />
                </>
            )}
        </>
    );
}