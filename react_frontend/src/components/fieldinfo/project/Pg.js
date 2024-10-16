import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { pjtMgrSearchForm } from '../../../atoms/searchFormAtoms';
import { selectedPjtMgrState, expandedRowState } from '../../../atoms/selectedRowAtoms';
import Swal from 'sweetalert2';
import { Card } from '@mui/material';
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms"
import {formField_pg} from "../../../assets/json/searchFormData"
import { pjtColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';
import dayjs from 'dayjs';
import * as pdsStyles from "../../../assets/css/pds.css";

export default function Pg() {
    const [formFields, setFormFields] = useState(formField_pg);
    const [formData, setFormData] = useRecoilState(pjtMgrSearchForm);
    const [projects, setProjects] = useState([]);                   // 검색 데이터(프로젝트 목록)
    const [selectedPjt, setSelectedPjt] = useRecoilState(selectedPjtMgrState);             // 선택된 프로젝트(PK column only)
    const [managers, setManagers] = useState([]);
    const [submittedPjtIdx, setSubmittedPjtIdx] = useState([]);
    const [newAddedPjtName, setNewAddedPjtName] = useState([]);
    const [expandedRow, setExpandedRow] = useRecoilState(expandedRowState);           // 아코디언 확장 상태
    const [isModalOpen, setIsModalOpen] = useState({
        PgAdd: false,
        Delete: false,
    });

    const fetchOptions = async (unitType) => {
        const response = await axiosInstance.get(`/sys/unit?unitType=${unitType}`);
        
        return response.data.map(item => ({
            value: item.code,
            label: item.name,
        }));
    };

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
    
    useEffect(() => {
        fetchDropDown();
        fetchProject();

        // formData값이 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        if(Object.keys(formData).length !== 0) {
            handleFormSubmit(formData);
        }

        if(Object.keys(selectedPjt).length !== 0) {
            fetchManagers(selectedPjt.id);
        }
    }, []);

    useEffect(() => {
        if (newAddedPjtName) {
            const newAddedIndices = newAddedPjtName
                .map(newPjtName => projects.findIndex(pjt => pjt.pjtName === newPjtName));
            console.log("newAddedIndices", newAddedIndices);
                if (newAddedIndices.length > 0 && !newAddedIndices.includes(-1)) {
                setSubmittedPjtIdx(newAddedIndices); // 찾아진 인덱스 배열 설정
            } else {
                setSubmittedPjtIdx([]);
                setNewAddedPjtName([]);
            }
        }
    }, [projects.length]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);
        setExpandedRow(null);

        // data.calendar가 정의되어 있지 않거나 값이 없는 경우를 처리하기 위해 설정
        // ISO 형식 문자열을 dayjs로 변환
        const startDate = data.calendar?.[0] ? dayjs(data.calendar[0]) : null;
        const endDate = data.calendar?.[1] ? dayjs(data.calendar[1]) : null;

        const params = {
            pjtCode : data.pjtCode,
            pjtName : data.pjtName,
            userLoginId : data.managerId,
            userName : data.managerName,
            divCode : data.divCode,
            pjtProgStus : data.pjtProgStus,
            regCode: data.reg,
            startDate: startDate ? dayjs(startDate).format('YYYY-MM') : undefined,
            endDate : endDate ? dayjs(endDate).format('YYYY-MM') : undefined,
            pgmsYn: 'y'
        };

        const response = await axiosInstance.get("/pjt", {params});
        setProjects(response.data);
        setSubmittedPjtIdx([]);
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = async ({row: pjt, rowIndex}) => {
        setSelectedPjt(pjt ?? {});

        if (expandedRow === rowIndex) {  // 같은 행을 클릭했을 때
            setExpandedRow(null);
            setManagers([]);
        } else {
            setExpandedRow(rowIndex);  // rowIndex를 저장
            await fetchManagers(pjt?.id);  // 선택한 프로젝트의 담당자 목록 불러오기
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
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        let swalOptions = {
            confirmButtonText: '확인'
        };
        
        if (modalType === 'PgAdd') {
            try {
                const newPjts = data;
                const pjtNameList = [];

                const requestBody = newPjts.map(project => {
                    pjtNameList.push(project.pjtName);
                    return {
                        id: project.id,
                    };
                });

                const response = await axiosInstance.post("/pjt", requestBody);

                handleFormSubmit(formData);
                setSelectedPjt({});
                setNewAddedPjtName(response.data.map(pjt => pjt.pjtName));

                swalOptions.title = '성공!',
                swalOptions.text = `${pjtNameList.join(', ')}이(가) 성공적으로 등록되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.html = error.response.data.message,
                swalOptions.icon = 'error';
            }

            // Swal.fire 실행 후, 성공 메시지가 표시되면 페이지 새로고침
            Swal.fire(swalOptions).then(() => {
                setExpandedRow(null);
            });
        } else if (modalType === 'Delete') {
            try {
                // 선택된 프로젝트를 project 리스트에서 제거
                setProjects(prevPjts => prevPjts.filter(project => project.id !== selectedPjt.id));
                setSelectedPjt({});
                setSubmittedPjtIdx([]);
                setExpandedRow(null);
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

    // 서치폼이 변경될 때 프로젝트 목록 clear
    const handleFieldsChange = () => {
        setProjects([]);
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 &gt; 프로젝트 관리</div>
            <SearchForms
                initialValues={formData}
                onFormSubmit={handleFormSubmit} 
                formFields={formFields}
                handleFieldsChange={handleFieldsChange}
                handleEmptyFields={fetchProject}
                isPg={true}
            />

            <div className={pdsStyles.main_grid}>
                <div className={pdsStyles.contents_container}>
                    {(!projects || Object.keys(projects).length === 0) ?
                    <></> : (
                        <Card sx={{ width: "100%", height: "auto", borderRadius: "0.5rem" }}>
                            <TableCustom 
                                title='프로젝트목록' 
                                data={projects}
                                submittedRowIdx={submittedPjtIdx}
                                columns={pjtColumns}            
                                buttons={['Delete', 'Add']}
                                onClicks={[onDeleteClick, onAddClick]}
                                onRowClick={handlePjtClick}
                                selectedRows={[selectedPjt]}
                                subData={managers}
                                expandedRow={expandedRow}
                                keyProp={projects.length}
                                modals={[
                                    isModalOpen.Delete && {
                                        'modalType': 'Delete',
                                        'isModalOpen': isModalOpen.Delete,
                                        'handleOk': handleOk('Delete'),
                                        'handleCancel': handleCancel('Delete'),
                                        'rowData': selectedPjt,
                                        'rowDataName': 'pjtName',
                                        'url': '/pjt'
                                    },
                                    isModalOpen.PgAdd && {
                                        'modalType': 'PgAdd',
                                        'isModalOpen': isModalOpen.PgAdd,
                                        'handleOk': handleOk('PgAdd'),
                                        'handleCancel': handleCancel('PgAdd')
                                    }
                                ]}
                            />
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}