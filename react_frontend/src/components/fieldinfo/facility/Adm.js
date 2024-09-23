import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { actvSearchForm } from '../../../atoms/searchFormAtoms';
import Swal from 'sweetalert2';
import { Card } from '@mui/material';
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import axiosInstance from '../../../utils/AxiosInstance';
import { formField_fam } from "../../../assets/json/searchFormData";
import { equipActvColumns, equipCoefColumns } from '../../../assets/json/tableColumn';
import * as mainStyles from "../../../assets/css/main.css";
import * as pdsStyles from "../../../assets/css/pds.css";

export default function Adm() {
    const [formFields, setFormFields] = useState(formField_fam);
    const [formData, setFormData] = useRecoilState(actvSearchForm);
    const [actves, setActves] = useState([]);                     // 활동자료목록
    const [selectedActv, setSelectedActv] = useState({});         // 선택된 활동자료
    const [emissionFactors, setEmissionFactors] = useState([]);
    const [filteredEfs, setFilteredEfs] = useState([]);
    const [selectedEF, setSelectedEF] = useState({});
    const [year, setYear] = useState(new Date().getFullYear());
    
    const [isModalOpen, setIsModalOpen] = useState({
        FamAdd: false,
        FamEdit: false,
        EfmAdd: false,
        EfmEdit: false,
        DeleteA: false,
        DeleteB: false,
    });

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

        // formData값이 있으면 활동자료를 findAll, 없으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        Object.keys(formData).length === 0 ? fetchActv() : handleFormSubmit(formData);
    }, []);

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

        try {
            const response = await axiosInstance.get("/equip/actv", {params});
            setActves(response.data);
            setEmissionFactors([]);
            setFormData(data);
        } catch (error) {
            console.error("Error fetching actv data:", error);
        }
    };

    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = async (data) => {
        const actv = data.row;
        
        // actv 없으면 setSelectedActv를 빈 객체로 설정하고, 함수 종료
        if (!actv) {
            setSelectedActv({});
            setEmissionFactors([]);
            return;
        }

        // actv가 있으면 setSelectedActv를 설정하고 API 호출
        setSelectedActv(actv);

        try {
            // 선택한 actv에 매핑된 배출계수 목록 조회
            const response = await axiosInstance.get(`/equip/coef?actvDataId=${actv.id}`);
            setEmissionFactors(response.data);
            setFilteredEfs(response.data);
        } catch (error) {
            console.error("Error fetching activity data:", error);
        }
    };

    // 배출계수 row 클릭 시 호출될 함수
    const handleEFClick = (ef) => {
        setSelectedEF(ef.row ?? {});
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
                swalOptions.text = error.response.data.message,
                swalOptions.icon = 'error';
            }
            Swal.fire(swalOptions);
        } else if (modalType === 'DeleteA') {
            // 선택된 활동자료를 actves 리스트에서 제거
            setActves(prevActves => prevActves.filter(actv => actv.id !== selectedActv.id));
            setSelectedActv({});
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
                swalOptions.text = error.response.data.message,
                swalOptions.icon = 'error';
            }
            Swal.fire(swalOptions);
        } else if (modalType === 'EfmAdd') {
            setFilteredEfs(prevList => [data, ...prevList]);
            setSelectedEF(data);
        } else if (modalType === 'EfmEdit') {
            setFilteredEfs(prevList =>
                prevList.map(item =>
                    item.id === data.id ? { ...item, ...data } : item
                )
            );
        } else if (modalType === 'DeleteB') {
            // 선택된 활동자료를 actves 리스트에서 제거
            setFilteredEfs(prevList => prevList.filter(item => item.id !== selectedEF.id));
            setSelectedEF({});
        }
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const handleYearChange = (year) => {
        setYear(year);
        const filteredResult = emissionFactors.filter((ef) => ef.applyYear === year);
        setFilteredEfs(filteredResult);
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 설비 &gt; 활동자료 관리</div>
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formFields} 
            />

            <div className={pdsStyles.main_grid}>
                <div className={pdsStyles.contents_container}>
                    <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                        <TableCustom 
                            title='활동자료목록' 
                            data={actves} 
                            columns={equipActvColumns}
                            buttons={['Delete', 'Edit', 'Add']}
                            onClicks={[() => showModal('DeleteA'), () => showModal('FamEdit'), () => showModal('FamAdd')]}
                            onRowClick={handleActvClick}
                            selectedRows={[selectedActv]}
                            modals={[
                                {
                                    'modalType': 'DeleteA',
                                    'isModalOpen': isModalOpen.DeleteA,
                                    'handleOk': handleOk('DeleteA'),
                                    'handleCancel': handleCancel('DeleteA'),
                                    'rowData': selectedActv,
                                    'rowDataName': 'actvDataName',
                                    'url': '/equip/actv'
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
                    </Card>

                    <Card sx={{ width: "50%", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                        {(!selectedActv || Object.keys(selectedActv).length === 0) ?
                        <div className={pdsStyles.card_container}>
                            <div className={pdsStyles.table_title} style={{ padding: "8px" }}>배출계수목록</div>
                        </div> : (
                            <TableCustom 
                                title="배출계수목록" 
                                data={filteredEfs}
                                columns={equipCoefColumns}
                                buttons={["Delete", "Edit", "Add"]} 
                                selectedRows={[selectedEF]} 
                                onRowClick={handleEFClick} 
                                onClicks={[() => showModal('DeleteB'), () => showModal('EfmEdit'), () => showModal('EfmAdd')]}
                                handleYearChange={handleYearChange}
                                year={year}
                                modals={
                                    [
                                        isModalOpen.EfmAdd && {
                                            "modalType" : 'EfmAdd',
                                            'isModalOpen': isModalOpen.EfmAdd,
                                            'handleOk': handleOk('EfmAdd'),
                                            'handleCancel': handleCancel('EfmAdd'),
                                            'rowData': selectedActv,
                                        },
                                        isModalOpen.EfmEdit && {
                                            "modalType" : 'EfmEdit',
                                            'isModalOpen': isModalOpen.EfmEdit,
                                            'handleOk': handleOk('EfmEdit'),
                                            'handleCancel': handleCancel('EfmEdit'),
                                            'rowData': {...selectedEF, "inputUnitCode" : selectedActv.inputUnitCode, "actvDataId": selectedActv.id},
                                        },
                                        isModalOpen.DeleteB && {
                                            "modalType" : 'DeleteB',
                                            'isModalOpen': isModalOpen.DeleteB,
                                            'handleOk': handleOk('DeleteB'),
                                            'handleCancel': handleCancel('DeleteB'),
                                            'rowData': selectedEF,
                                            'rowDataName': "applyDvs",
                                            'url': '/equip/coef',
                                        },
                                    ]
                                }
                            />
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}