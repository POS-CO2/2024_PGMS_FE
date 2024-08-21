import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import * as tableStyles from "../../../assets/css/newTable.css"
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms"
import {formField_pg} from "../../../assets/json/searchFormData.js"
import axiosInstance from '../../../utils/AxiosInstance';

export default function Pg() {
    const [formFields, setFormFields] = useState(formField_pg);
    const [projects, setProjects] = useState({});           // 검색 데이터(프로젝트 목록)
    const [selectedPjt, setSelectedPjt] = useState(null);   // 선택된 프로젝트(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        PgAdd: false,
        Del: false
    });

    const fetchOptions = async (unitType) => {
        const response = await axiosInstance.get(`/sys/unit?unitType=${unitType}`);
        return response.data.map(item => ({
            value: item.code,
            label: item.name,
        }));
    };
    
    useEffect(() => {
        const fetchDropDown = async () => {
            try {
                // 여러 개의 비동기 작업을 병렬로 실행하기 위해 await Promise.all 사용
                const [optionsPS, optionsReg] = await Promise.all([
                    fetchOptions('프로젝트진행상태'),
                    fetchOptions('지역코드')
                ]);
    
                // formField_pg를 업데이트
                const updateFormFields = formField_pg.map(field => {
                    if (field.name === 'PjtProgStus') {
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
    }, []);

    // selectedPjt 변경될 때마다 실행될 useEffect
    useEffect(() => {}, [selectedPjt]);

    // saleAmt 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (projects.length === 0) {
            const placeholderPjt = {
                id: '',
                프로젝트코드: '',
                프로젝트명: '',
                프로젝트유형: '',
                지역: '',
                프로젝트시작년: '',
                프로젝트시작월: '',
                프로젝트종료년: '',
                프로젝트종료월: '',
                본부: '',
                연면적: '',
                프로젝트진행상태: ''
            };
            setProjects([placeholderPjt]);
        }
    }, [projects]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        const params = {
            pjtCode : data.pjtCode,
            pjtName : data.pjtName,
            userLoginId : data.userLoginId,
            userName : data.userName,
            divCode : data.divCode,
            pjtProgStus : data.pjtProgStus,
            startDate : data.startDate,
            endDate : data.endDate,
            pgmsYn: 'y'
        };

        const response = await axiosInstance.get("/pjt", {params});

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderPjt = {
                id: '',
                프로젝트코드: '',
                프로젝트명: '',
                프로젝트유형: '',
                지역: '',
                프로젝트시작년: '',
                프로젝트시작월: '',
                프로젝트종료년: '',
                프로젝트종료월: '',
                본부: '',
                연면적: '',
                프로젝트진행상태: ''
            };
            setProjects([placeholderPjt]);
        } else {
            // 필요한 필드만 추출하여 projects 설정
            const filteredPjts = response.data.map(project => ({
                id: project.id,
                프로젝트코드: project.pjtCode,
                프로젝트명: project.pjtName,
                프로젝트유형: project.pjtType,
                지역: project.regCode,
                프로젝트시작년: project.ctrtFrYear,
                프로젝트시작월: project.ctrtFrMth,
                프로젝트종료년: project.ctrtToYear,
                프로젝트종료월: project.ctrtToMth,
                본부: project.divCode,
                연면적: project.bldArea,
                프로젝트진행상태: project.pjtProgStus
            }));

            setProjects(filteredPjts);
        }
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (pjt) => {
        setSelectedPjt(pjt?.id ?? null);
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
                
                // 데이터가 객체인 경우 처리 방법
                const filteredData = response.data.map(project => ({
                    id: project.id,
                    프로젝트코드: project.pjtCode,
                    프로젝트명: project.pjtName,
                    프로젝트유형: project.pjtType,
                    지역: project.regCode,
                    프로젝트시작년: project.ctrtFrYear,
                    프로젝트시작월: project.ctrtFrMth,
                    프로젝트종료년: project.ctrtToYear,
                    프로젝트종료월: project.ctrtToMth,
                    본부: project.divCode,
                    연면적: project.bldArea,
                    프로젝트진행상태: project.pjtProgStus
                }));

                // 기존 프로젝트에서 placeholderPjt를 제거하고 새 데이터를 병합
                setProjects(prevPjts => {
                    // placeholderProject 제거
                    const cleanedPjts = prevPjts.filter(pjt => pjt.id !== '');

                    // 새로 추가된 프로젝트를 병합
                    return [...cleanedPjts, ...filteredData];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '프로젝트가 성공적으로 등록되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log("aa:", error);

                swalOptions.title = '실패!',
                swalOptions.text = '프로젝트 등록에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'Del') {
            try {
                console.log("selectedPjt", selectedPjt);
                const response = await axiosInstance.patch(`/pjt?id=${selectedPjt}`);

                // 선택된 프로젝트를 project 리스트에서 제거
                setProjects(prevPjts => prevPjts.filter(project => project.id !== selectedPjt));
                setSelectedPjt(null);

                swalOptions.title = '성공!',
                swalOptions.text = '프로젝트가 성공적으로 삭제되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '프로젝트 삭제에 실패하였습니다.';
                swalOptions.icon = 'success';
            }
        } 
        Swal.fire(swalOptions);
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
        showModal('Del');
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
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handlePjtClick}
                        selectedRows={[selectedPjt]}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
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