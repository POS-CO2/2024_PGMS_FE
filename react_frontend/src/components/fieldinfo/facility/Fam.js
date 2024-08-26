import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import * as mainStyles from "../../../assets/css/main.css"
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import { formField_fam } from "../../../assets/json/searchFormData";
import { equipActvColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';

export default function Fam() {
    const [formFields, setFormFields] = useState(formField_fam);
    const [actves, setActves] = useState([]);                     // 활동자료목록
    const [selectedActv, setSelectedActv] = useState({});         // 선택된 활동자료
    const [isModalOpen, setIsModalOpen] = useState({
        FamAdd: false,
        FamEdit: false,
        Del: false
    });

    class Actv {
        constructor(id = '', actvDataName = '', actvDataDvs = '', emtnActvType = '', calUnitCode = '', inputUnitCode = '', unitConvCoef = '') {
            this.id = id;
            this.actvDataName = actvDataName;
            this.actvDataDvs = actvDataDvs;
            this.emtnActvType = emtnActvType;
            this.calUnitCode = calUnitCode;
            this.inputUnitCode = inputUnitCode;
            this.unitConvCoef = unitConvCoef;            ;
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
                setActves(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDropDown = async () => {
            try {
                // 여러 개의 비동기 작업을 병렬로 실행하기 위해 await Promise.all 사용
                const [optionsDvs, optionsType, optionsSpecUnit] = await Promise.all([
                    fetchOptions('활동자료구분'),
                    fetchOptions('배출활동유형'),
                    fetchOptions('설비사양단위')
                ]);
    
                // formField_fl를 업데이트
                const updateFormFields = formField_fam.map(field => {
                    if (field.name === 'actvDataDvs') {
                        return { ...field, options: optionsDvs };
                    } else if (field.name === 'emtnActvType') {
                        return { ...field, options: optionsType };
                    } else if (field.name === 'inputUnit') {
                        return { ...field, options: optionsSpecUnit };
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
            calUnitCode: data.calUnit,
            inputUnitCode: data.inputUnit,
            unitConvCoef: data.unitConvCoef
        };

        const response = await axiosInstance.get("/equip/actv", {params});

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderActv = new Actv();
            setActves([placeholderActv]);
        } else {
            setActves(response.data);
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
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'FamAdd') {
            try {
                const requestBody = {
                    actvDataName: data.actvDataName,
                    actvDataDvs: data.actvDataDvs,
                    emtnActvType: data.emtnActvType,
                    calUnitCode: data.calUnit,
                    inputUnitCode: data.inputUnit,
                    unitConvCoef: data.unitConvCoef,
                };

                const response = await axiosInstance.post("/equip/actv", requestBody);

                // 기존 프로젝트에서 placeholderPjt를 제거하고 새 데이터를 병합
                setActves(prevActves => {
                    // placeholderProject 제거
                    const cleanedActves = prevActves.filter(actv => actv.id !== '');

                    // 새로 추가된 활동자료를 병합
                    return [...cleanedActves, response.data];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '활동자료가 성공적으로 등록되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '활동자료 등록에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'Del') {
            try {
                const response = await axiosInstance.delete(`/equip/actv?id=${selectedActv.id}`);

                // 선택된 활동자료를 actves 리스트에서 제거
                setActves(prevActves => prevActves.filter(actv => actv.id !== selectedActv.id));
                setSelectedActv({});

                swalOptions.title = '성공!',
                swalOptions.text = '활동자료가 성공적으로 삭제되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '활동자료 삭제에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'FamEdit') {
            try {
                const requestBody = {
                    id: selectedActv.id,
                    actvDataName: data.actvDataName,
                    actvDataDvs: data.actvDataDvs,
                    emtnActvType: data.emtnActvType,
                    calUnitCode: data.calUnitCode,
                    inputUnitCode: data.inputUnitCode,
                    unitConvCoef: data.unitConvCoef
                };

                const response = await axiosInstance.patch("/equip/actv", requestBody);

                // 서버로부터 받은 수정된 데이터를 사용하여 리스트 업데이트
                setActves(prevActves => 
                    prevActves.map(actv => 
                        actv.id === selectedActv.id ? response.data : actv
                    )
                );
                setSelectedActv({});

                swalOptions.title = '성공!',
                swalOptions.text = '활동자료가 성공적으로 수정되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '활동자료 수정에 실패하였습니다.';
                swalOptions.icon = 'error';
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
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 설비 &gt; 활동자료 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />

            <TableCustom 
                title='활동자료목록' 
                data={actves} 
                columns={equipActvColumns}
                buttons={['Delete', 'Edit', 'Add']}
                onClicks={[onDeleteClick, onEditClick, onAddClick]}
                onRowClick={handleActvClick}
                selectedRows={[selectedActv.id]}
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
                        'rowData': selectedActv,
                        'dropDown': formFields
                    },
                    {
                        'modalType': 'FamAdd',
                        'isModalOpen': isModalOpen.FamAdd,
                        'handleOk': handleOk('FamAdd'),
                        'handleCancel': handleCancel('FamAdd'),
                        'dropDown': formFields
                    }
                ]}
            />
        </>
    );
}