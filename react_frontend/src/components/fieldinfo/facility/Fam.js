import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {actv} from "../../../assets/json/selectedPjt";
import {formField_fam} from "../../../assets/json/searchFormData.js";
import axiosInstance from '../../../utils/AxiosInstance';

export default function Fam() {
    const [formFields, setFormFields] = useState(formField_fam);
    const [actves, setActves] = useState([]);                     // 활동자료목록
    const [selectedActv, setSelectedActv] = useState({});       // 선택된 활동자료
    const [isModalOpen, setIsModalOpen] = useState({
        FamAdd: false,
        FamEdit: false,
        Del: false
    });

    class Actv {
        constructor(id = '', actvDataName = '', actvDataDvs = '', emtnActvType = '', calUnit = '', inputUnit = '', unitConvCoef = '') {
            this.id = id;
            this.활동자료명 = actvDataName;
            this.활동자료구분 = actvDataDvs;
            this.배출활동유형 = emtnActvType;
            this.산정단위 = calUnit;
            this.입력단위 = inputUnit;
            this.단위환산계수 = unitConvCoef;            ;
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
        const fetchActv = async () => {
            try {
                const response = await axiosInstance.get(`/equip/actv`);

                const filteredActves = response.data.map(actv => new Actv(
                    actv.id,
                    actv.actvDataName,
                    actv.actvDataDvs,
                    actv.emtnActvType,
                    actv.calUnit,
                    actv.inputUnit,
                    actv.unitConvCoef
                ));

                setActves(filteredActves);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDropDown = async () => {
            try {
                // 여러 개의 비동기 작업을 병렬로 실행하기 위해 await Promise.all 사용
                const [optionsDvs, optionsType] = await Promise.all([
                    fetchOptions('활동자료구분'),
                    fetchOptions('배출활동유형')
                ]);
    
                // formField_fl를 업데이트
                const updateFormFields = formField_fam.map(field => {
                    if (field.name === 'actvDataName') {
                        return { ...field, options: optionsDvs };
                    } else if (field.name === 'actvDataDvs') {
                        return { ...field, options: optionsType };
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
        fetchActv();
    }, []);
    
    // selectedActv 변경될 때마다 실행될 useEffect
    useEffect(() => {}, [selectedActv]);

    // actves 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (actves.length === 0) {
            const placeholderActv = new Actv();
            setActves([placeholderActv]);
        }
    }, [actves]);

    //조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        const params = {
            actvDataName: data.actvDataName,
            actvDataDvs: data.actvDataDvs,
            emtnActvType: data.emtnActvType,
            calUnit: data.calUnit,
            inputUnit: data.inputUnit,
            unitConvCoef: data.unitConvCoef
        };

        const response = await axiosInstance.get("/equip/lib", {params});

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderActv = new Actv();
            setActves([placeholderActv]);
        } else {
            // 필요한 필드만 추출하여 managers에 설정
            const filteredActves = response.data.map(actv => new Actv(
                actv.id,
                actv.actvDataName,
                actv.actvDataDvs,
                actv.emtnActvType,
                actv.calUnit,
                actv.inputUnit,
                actv.unitConvCoef,
            ));
            setEqLibs(filteredActves);
        }
    };

    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (actv) => {
        setSelectedActv(actv ?? {});
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 활동자료 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        console.log("data", data);
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'FlAdd') {
            try {
                const requestBody = data.map(eqLib => ({
                    equipLibName: eqLib.eqLibName,
                    equipDvs: eqLib.eqDvs,
                    equipType: eqLib.eqType,
                    equipSpecUnit: eqLib.eqSpecUnit,
                }));

                console.log("requestBody", requestBody);
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
                setSelectedEqLib(prevEqLibs => {
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
        showModal('FamAdd');
    };

    const onEditClick = () => {
        showModal('FamEdit');
    };

    const onDeleteClick = () => {
        showModal('Del');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 설비 &gt; 활동자료 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fam} />

            {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( //TODO: 백엔드에서 받아온 값으로 바꾸기(data 파라미터)
                <>
                    <TableCustom 
                        title='활동자료목록' 
                        data={actv} 
                        buttons={['Delete', 'Edit', 'Add']}
                        onClicks={[onDeleteClick, onEditClick, onAddClick]}
                        onRowClick={handleActvClick}
                        selectedRows={[selectedActv.actvDataName]}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
                            },
                            {
                                'modalType': 'FamEdit',
                                'isModalOpen': isModalOpen.FamEdit,
                                'handleOk': handleOk('FamEdit'),
                                'handleCancel': handleCancel('FamEdit'),
                                'rowData': selectedActv
                            },
                            {
                                'modalType': 'FamAdd',
                                'isModalOpen': isModalOpen.FamAdd,
                                'handleOk': handleOk('FamAdd'),
                                'handleCancel': handleCancel('FamAdd')
                            }
                        ]}
                    />
                </>
            )}
        </>
    );
}