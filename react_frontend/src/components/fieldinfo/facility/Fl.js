import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {formField_fl} from "../../../assets/json/searchFormData.js";
import axiosInstance from '../../../utils/AxiosInstance';

export default function Fl() {
    const [formFields, setFormFields] = useState(formField_fl);
    const [eqLibs, setEqLibs] = useState([]);
    const [selectedEqLib, setSelectedEqLib] = useState(null);     // 선택된 설비 LIB 목록(PK column only)
    const [isModalOpen, setIsModalOpen] = useState({
        FlAdd: false,
        FlEdit: false,
        Del: false
    });

    class EqLib {
        constructor(id = '', equipLibName = '', equipDvs = '', equipType = '', equipSpecUnit = '') {
            this.id = id;
            this.설비라이브러리명 = equipLibName;
            this.설비구분 = equipDvs;
            this.설비유형 = equipType;
            this.설비사양단위 = equipSpecUnit;
        }
    }

    const fetchOptions = async (unitType) => {
        const response = await axiosInstance.get(`/sys/unit?unitType=${unitType}`);
        return response.data.map(item => ({
            value: item.code,
            label: item.name,
        }));
    };
    
    useEffect(() => {
        const fetchEqLib = async () => {
            try {
                const response = await axiosInstance.get(`/equip/lib`);
                console.log("response", response)
                const filteredEqLibs = response.data.map(eqLib => new EqLib(
                    eqLib.id,
                    eqLib.equipLibName,
                    eqLib.equipDvs,
                    eqLib.equipType,
                    eqLib.equipSpecUnit
                ));

                setEqLibs(filteredEqLibs);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDropDown = async () => {
            try {
                // 여러 개의 비동기 작업을 병렬로 실행하기 위해 await Promise.all 사용
                const [optionsDvs, optionsType, optionSpecUnit] = await Promise.all([
                    fetchOptions('설비구분'),
                    fetchOptions('설비유형'),
                    fetchOptions('설비사양단위'),
                ]);
    
                // formField_fl를 업데이트
                const updateFormFields = formField_fl.map(field => {
                    if (field.name === 'equipDvs') {
                        return { ...field, options: optionsDvs };
                    } else if (field.name === 'equipType') {
                        return { ...field, options: optionsType };
                    } else if (field.name === 'equipSpecUnit') {
                        return { ...field, options: optionSpecUnit };
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
        fetchEqLib();
    }, []);
    
    // selectedEqLib 변경될 때마다 실행될 useEffect
    useEffect(() => {}, [selectedEqLib]);

    // EqLibs 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (eqLibs.length === 0) {
            const placeholderEqLib = new EqLib();
            setEqLibs([placeholderEqLib]);
        }
    }, [eqLibs]);

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        console.log("data", data);
        const params = {
            equipLibName: data.equipLibName,
            equipDvs: data.equipDvs,
            equipType: data.equipType,
            equipSpecUnit: data.equipSpecUnit
        };

        const response = await axiosInstance.get("/equip/lib", {params});

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderSA = new EqLib();
            setEqLibs([placeholderSA]);
        } else {
            // 필요한 필드만 추출하여 managers에 설정
            const filteredEqLibs = response.data.map(eqLib => new EqLib(
                eqLib.id,
                eqLib.equipLibName,
                eqLib.equipDvs,
                eqLib.equipType,
                eqLib.equipSpecUnit
            ));
            setEqLibs(filteredEqLibs);
        }
    };

    // 설비LIB row 클릭 시 호출될 함수
    const handleEqLibClick = (lib) => {
        setSelectedEqLib(lib?.id ?? null);
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 설비LIB 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'FlAdd') {
            try {
                const requestBody = {
                    equipLibName: data.eqLibName,
                    equipDvs: data.eqDvs,
                    equipType: data.eqType,
                    equipSpecUnit: data.eqSpecUnit,
                };

                const response = await axiosInstance.post("/equip/lib", requestBody);
                
                // 데이터가 객체인 경우 처리 방법
                const filteredData = new EqLib(
                    response.data.id,
                    response.data.equipLibName,
                    response.data.equipDvs,
                    response.data.equipType,
                    response.data.equipSpecUnit
                );

                // 기존 프로젝트에서 placeholderPjt를 제거하고 새 데이터를 병합
                setEqLibs(prevEqLibs => {
                    // placeholderProject 제거
                    const cleanedEqLibs = prevEqLibs.filter(eqLib => eqLib.id !== '');

                    // 새로 추가된 설비LIB을 병합
                    return [...cleanedEqLibs, filteredData];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '설비LIB가 성공적으로 등록되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log("aa:", error);

                swalOptions.title = '실패!',
                swalOptions.text = '설비LIB 등록에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'Del') {
            try {
                const response = await axiosInstance.delete(`/equip?id=${selectedEqLib}`);

                // 선택된 설비LIB를 eqLib 리스트에서 제거
                setEqLibs(prevEqLibs => prevEqLibs.filter(eqLib => eqLib.id !== selectedEqLib));
                setSelectedEqLib(null);

                swalOptions.title = '성공!',
                swalOptions.text = '설비LIB이 성공적으로 삭제되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '설비LIB 삭제에 실패하였습니다.';
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
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 설비 &gt; 설비 LIB 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />
            
            <TableCustom 
                title='설비LIB목록' 
                data={eqLibs}                   
                buttons={['Delete', 'Edit', 'Add']}
                onClicks={[onDeleteClick, onEditClick, onAddClick]}
                onRowClick={(e) => handleEqLibClick(e)}
                selectedRows={[selectedEqLib]}
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
                        'handleCancel': handleCancel('FlAdd'),
                        'rowData': formFields
                    }
                ]}
            />
        </>
    );
}