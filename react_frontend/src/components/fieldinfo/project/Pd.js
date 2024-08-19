import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import * as tableStyles from "../../../assets/css/newTable.css";
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import project from "../../../assets/json/selectedPjt";
//import managers from "../../../assets/json/manager";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData.js";
import axiosInstance from '../../../utils/AxiosInstance';

export default function Pd() {
    const [formData, setFormData] = useState({});                       // 검색 데이터
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);       // 선택된 담당자(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        PdAdd: false,
        Del: false
    });

    // selectedManager가 변경될 때마다 실행될 useEffect
    useEffect(() => {
    }, [selectedManager]);

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (param) => {
        setFormData([param.searchProject]);
        const {data} = await axiosInstance.get(`/pjt/manager?pjtId=${param.searchProject.id}`);
        setManagers(data);
    };
    
    // 담당자 row 클릭 시 호출될 함수
    const handleManagerClick = (manager) => {
        setSelectedManager(manager?.id ?? null);
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    // modalType에 따라 결과 처리 해주기
    const handleOk = (modalType) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기

        // modalType에 따른 SweetAlert2 설정
        let swalOptions = {
            title: 'Success!',
            confirmButtonText: '확인'
        };

        if (modalType === 'PdAdd') {
            try {
                const requestBody = [
                    {
                        pjtId: formData[0].id,
                        userId: data[0].id
                    }
                ];
                const response = await axiosInstance.post("/pjt/manager", requestBody);

                swalOptions.text = '담당자가 성공적으로 추가되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);
                //TODO: sweet alert 알림
            }
        } else if (modalType === 'Del') {
            try {
                console.log("selectedManager:", selectedManager);
                const response = await axiosInstance.delete(`/pjt/manager?id=${selectedManager}`);

                swalOptions.text = '담당자가 성공적으로 삭제되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);
                //TODO: sweet alert 알림
            }
        } 

        Swal.fire(swalOptions);
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
        showModal('Del');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0]]} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={formData} />                    
                    <TableCustom
                        title='담당자목록' 
                        data={managers}                   
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handleManagerClick}
                        selectedRows={[selectedManager]}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del'),
                                'rowData': selectedManager
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