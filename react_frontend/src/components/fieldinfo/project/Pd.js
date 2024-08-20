import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import * as tableStyles from "../../../assets/css/newTable.css";
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData";
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
    useEffect(() => {}, [selectedManager]);

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (param) => {
        setFormData([param.searchProject]);
        const {data} = await axiosInstance.get(`/pjt/manager?pjtId=${param.searchProject.id}`);
        
        // 필요한 필드만 추출하여 managers에 설정
        const filteredManagers = data.map(manager => ({
            id: manager.id,
            사번: manager.userId,
            이름: manager.userName,
            부서: manager.userDeptCode
        }));

        setManagers(filteredManagers);
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
                // data 배열을 순회하며 requestBody 배열 생성
                const requestBody = data.map(user => ({
                    pjtId: formData[0].id,
                    userId: user.id
                }));

                const response = await axiosInstance.post("/pjt/manager", requestBody);

                swalOptions.text = '담당자가 성공적으로 지정되었습니다.';
                swalOptions.icon = 'success';

                // 기존 managers에 새로 추가된 담당자를 병합
                setManagers(prevManagers => [...prevManagers, ...data]);
            } catch (error) {
                console.log(error);
                swalOptions.text = '담당자 지정에 실패하였습니다.';
                swalOptions.icon = 'fail';
            }
        } else if (modalType === 'Del') {
            try {
                const response = await axiosInstance.delete(`/pjt/manager?id=${selectedManager}`);

                swalOptions.text = '담당자가 성공적으로 삭제되었습니다.';
                swalOptions.icon = 'success';

                // 선택된 담당자를 managers 리스트에서 제거
                setManagers(prevManagers => prevManagers.filter(manager => manager.id !== data));

            } catch (error) {
                console.log(error);
                swalOptions.text = '담당자 삭제에 실패하였습니다.';
                swalOptions.icon = 'success';
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
                        renderRow={(manager) => {
                            // 화면에 표시할 때는 id를 제외하고 표시
                            const { id, ...visibleData } = manager;
                            return (
                                <tr key={id} onClick={() => handleManagerClick(manager)}>
                                    {Object.values(visibleData).map((value, index) => (
                                        <td key={index}>{value}</td>
                                    ))}
                                </tr>
                            );
                        }}
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