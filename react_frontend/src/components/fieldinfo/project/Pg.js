import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms"
import {formField_pg} from "../../../assets/json/searchFormData"
import { pjtColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';
import dayjs from 'dayjs';

export default function Pg() {
    const [formFields, setFormFields] = useState(formField_pg);
    const [projects, setProjects] = useState([]);                   // 검색 데이터(프로젝트 목록)
    const [selectedPjt, setSelectedPjt] = useState({});           // 선택된 프로젝트(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        PgAdd: false,
        Delete: false
    });

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

    // saleAmt 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (projects.length === 0) {
            const placeholderPjt = {
                id: '',
                pjtCode: '',
                pjtName: '',
                pjtName: '',
                reg: '',
                ctrtFrYear: '',
                ctrtFrMth: '',
                ctrtToYear: '',
                ctrtToMnt: '',
                div: '',
                bldArea: '',
                pjtProgStus: ''
            };
            setProjects([placeholderPjt]);
        }
    }, [projects]);

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

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderPjt = {
                id: '',
                pjtCode: '',
                pjtName: '',
                pjtName: '',
                reg: '',
                ctrtFrYear: '',
                ctrtFrMth: '',
                ctrtToYear: '',
                ctrtToMnt: '',
                div: '',
                bldArea: '',
                pjtProgStus: ''
            };
            setProjects([placeholderPjt]);
        } else {
            setProjects(response.data);
        }
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (pjt) => {
        setSelectedPjt(pjt ?? {});
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
                const requestBody = data.map(project => ({
                    id: project.id,
                }));

                const response = await axiosInstance.post("/pjt", requestBody);

                // 기존 프로젝트에서 placeholderPjt를 제거하고 새 데이터를 병합
                setProjects(prevPjts => {
                    // placeholderProject 제거
                    const cleanedPjts = prevPjts.filter(pjt => pjt.id !== '');

                    // 새로 추가된 프로젝트를 병합
                    return [...cleanedPjts, ...response.data];
                });

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
            // Swal.fire(swalOptions).then((result) => {
            //     // 사용자가 확인 버튼을 클릭했을 때만 리렌더링
            //     if (result.isConfirmed) { 
            //         window.location.reload();
            //     }
            // });
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
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(Table 컴포넌트의 data 파라미터)
                <>
                    <TableCustom 
                        title='프로젝트목록' 
                        data={projects}
                        columns={pjtColumns}            
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handlePjtClick}
                        selectedRows={[selectedPjt]}
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