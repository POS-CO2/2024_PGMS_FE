import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Card, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms"
import {formField_pg} from "../../../assets/json/searchFormData"
import { pjtColumns, pjtManagerColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';
import dayjs from 'dayjs';
import { managerState } from "../../../atoms/pdsAtoms";

export default function Pg() {
    const [formFields, setFormFields] = useState(formField_pg);
    const [projects, setProjects] = useState([]);                   // 검색 데이터(프로젝트 목록)
    const [selectedPjt, setSelectedPjt] = useState({});             // 선택된 프로젝트(PK column only)
    const [managers, setManagers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState({
        PgAdd: false,
        Delete: false
    });
    const [expandedRow, setExpandedRow] = useState(null);           // 아코디언 확장 상태

    const fetchOptions = async (unitType) => {
        const response = await axiosInstance.get(`/sys/unit?unitType=${unitType}`);
        return response.data.map(item => ({
            value: item.code,
            label: item.name,
        }));
    };
    
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get(`/pjt?pgmsYn=y`);

                setProjects(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDropDown = async () => {
            try {
                // 여러 개의 비동기 작업을 병렬로 실행하기 위해 await Promise.all 사용
                const [optionsDiv, optionsPS, optionsReg] = await Promise.all([
                    fetchOptions('본부코드'),
                    fetchOptions('프로젝트진행상태'),
                    fetchOptions('지역코드')
                ]);
    
                // formField_pg를 업데이트
                const updateFormFields = formField_pg.map(field => {
                    if (field.name === 'divCode') {
                        return { ...field, options: optionsDiv };
                    } else if (field.name === 'pjtProgStus') {
                        return { ...field, options: optionsPS };
                    } else if (field.name === 'reg') {
                        return { ...field, options: optionsReg };
                    } else {
                        return field;
                    }
                });

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchDropDown();
        fetchProject();
    }, []);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        // data.calendar가 정의되어 있지 않거나 값이 없는 경우를 처리하기 위해 설정
        const startDate = data.calendar?.[0]?.$d;
        const endDate = data.calendar?.[1]?.$d;

        const params = {
            pjtCode : data.pjtCode,
            pjtName : data.pjtName,
            userLoginId : data.userLoginId,
            userName : data.userName,
            divCode : data.divCode,
            pjtProgStus : data.pjtProgStus,
            regCode: data.reg,
            startDate: startDate ? dayjs(startDate).format('YYYY-MM') : undefined,
            endDate : endDate ? dayjs(endDate).format('YYYY-MM') : undefined,
            pgmsYn: 'y'
        };

        const response = await axiosInstance.get("/pjt", {params});

        setProjects(response.data);
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = async ({row: pjt, rowIndex}) => {
        setSelectedPjt(pjt ?? {});

        if (expandedRow === rowIndex) {  // 같은 행을 클릭했을 때
            setExpandedRow(null);
            setManagers([]);
        } else {
            setExpandedRow(rowIndex);  // rowIndex를 저장
            await fetchManagers(pjt.id);  // 선택한 프로젝트의 담당자 목록 불러오기
        }
    };

    const fetchManagers = async (pjtId) => {
        try {
            const response = await axiosInstance.get(`/pjt/manager?pjtId=${pjtId}`);
            setManagers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 프로젝트 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        console.log("data", data);
        const newPjts = data.row;

        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기

        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'PgAdd') {
            try {
                const requestBody = newPjts.map(project => ({
                    id: project.id,
                }));

                const response = await axiosInstance.post("/pjt", requestBody);

                setProjects(prevPjts => [...prevPjts, ...response.data]);

                swalOptions.title = '성공!',
                swalOptions.text = '프로젝트가 성공적으로 등록되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '프로젝트 등록에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
            Swal.fire(swalOptions);
        } else if (modalType === 'Delete') {
            try {
                // 선택된 프로젝트를 project 리스트에서 제거
                setProjects(prevPjts => prevPjts.filter(project => project.id !== selectedPjt.id));
                setSelectedPjt({});
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
        showModal('PgAdd');
    };

    const onDeleteClick = () => {
        showModal('Delete');
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 &gt; 프로젝트 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />

            {(!projects || Object.keys(projects).length === 0) ?
            <></> : (
                <>
                    <TableCustom 
                        title='프로젝트목록' 
                        data={projects}
                        columns={pjtColumns}            
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handlePjtClick}
                        selectedRows={[selectedPjt]}
                        subData={managers}
                        expandedRow={expandedRow}
                        modals={[
                            {
                                'modalType': 'Delete',
                                'isModalOpen': isModalOpen.Delete,
                                'handleOk': handleOk('Delete'),
                                'handleCancel': handleCancel('Delete'),
                                'rowData': selectedPjt,
                                'rowDataName': 'pjtName',
                                'url': '/pjt'
                            },
                            {
                                'modalType': 'PgAdd',
                                'isModalOpen': isModalOpen.PgAdd,
                                'handleOk': handleOk('PgAdd'),
                                'handleCancel': handleCancel('PgAdd')
                            }
                        ]}
                    />
                </>
            )}
        </>
    );
}