import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import * as tableStyles from "../../../assets/css/newTable.css";
import * as mainStyles from "../../../assets/css/main.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData";
import { pjtColumns, pjtManagerColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';

export default function Pd() {
    const [formData, setFormData] = useState([]);                       // 검색 데이터(프로젝트 조회 결과)
    const [managers, setManagers] = useState([]);                       // 조회 결과(담당자 목록 리스트)
    const [selectedManager, setSelectedManager] = useState({});       // 선택된 담당자(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        PdAdd: false,
        Delete: false
    });

    // selectedManager가 변경될 때마다 실행될 useEffect
    useEffect(() => {}, [selectedManager]);

    // managers 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (managers.length === 0) {
            const placeholderManager = {
                id: '',
                userLoginId: '',
                userName: '',
                userDeptCode: ''
            };
            setManagers([placeholderManager]);
        }
    }, [managers]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData([data.searchProject]);
        const response = await axiosInstance.get(`/pjt/manager?pjtId=${data.searchProject.id}`);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderManager = {
                id: '',
                userLoginId: '',
                userName: '',
                userDeptCode: ''
            };

            // 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setManagers([placeholderManager]);
        } else {
            setManagers(response.data);
        }
    };
    
    // 담당자 row 클릭 시 호출될 함수
    const handleManagerClick = (manager) => {
        setSelectedManager(manager ?? {});
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기

        let swalOptions = {
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

                // 기존 managers에서 placeholderManager 제거하고 새 데이터를 병합
                setManagers(prevManagers => {
                    // placeholderManager 제거
                    const cleanedManagers = prevManagers.filter(manager => manager.id !== '');

                    // 새로 추가된 담당자를 병합
                    return [...cleanedManagers, ...response.data];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '담당자가 성공적으로 지정되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '담당자 지정에 실패하였습니다.';
                swalOptions.icon = 'fail';
            }
            Swal.fire(swalOptions);
        } else if (modalType === 'Delete') {
            try {
                // 선택된 담당자를 managers 리스트에서 제거
                setManagers(prevManagers => prevManagers.filter(manager => manager.id !== selectedManager.id));
                setSelectedManager({});
            } catch (error) {
                console.log(error);
            }
        } 
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 버튼 클릭 시 모달 열림 설정
    const onAddClick = () => {
        showModal('PdAdd');
    };

    const onDeleteClick = () => {
        showModal('Delete');
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0]]} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : (
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table 
                        data={formData}
                        columns={pjtColumns}
                        key={JSON.stringify(formData)} // formData 변경 시 key 변경되어 리렌더링
                    />                    
                    <TableCustom
                        title='담당자목록' 
                        data={managers}
                        columns={pjtManagerColumns}                 
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handleManagerClick}
                        selectedRows={[selectedManager]}
                        modals={[
                            {
                                'modalType': 'Delete',
                                'isModalOpen': isModalOpen.Delete,
                                'handleOk': handleOk('Delete'),
                                'handleCancel': handleCancel('Delete'),
                                'rowData': selectedManager,
                                'rowDataName': 'userName',
                                'url': '/pjt/manager'
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