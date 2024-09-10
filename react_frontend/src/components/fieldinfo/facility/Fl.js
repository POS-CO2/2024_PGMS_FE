import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {formField_fl} from "../../../assets/json/searchFormData";
import { equipLibColumns, equipActvColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';
import * as mainStyles from "../../../assets/css/main.css"
import * as pdsStyles from "../../../assets/css/pds.css";

export default function Fl() {
    const [formFields, setFormFields] = useState(formField_fl);
    const [eqLibs, setEqLibs] = useState([]);
    const [selectedEqLib, setSelectedEqLib] = useState({});     // 선택된 설비 LIB
    const [actves, setActves] = useState([]);
    const [selectedActv, setSelectedActv] = useState({});
    const [isModalOpen, setIsModalOpen] = useState({
        FlAdd: false,
        FlEdit: false,
        FadAdd: false,
        DeleteA: false, // 설비LIB 삭제
        DeleteB: false, // 증빙자료 삭제
    });

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
                const response = await axiosInstance.get("/equip/lib");
                setEqLibs(response.data);
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

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        const params = {
            equipLibName: data.equipLibName,
            equipDvs: data.equipDvs,
            equipType: data.equipType,
            equipSpecUnit: data.equipSpecUnit
        };

        try {
            const response = await axiosInstance.get("/equip/lib", {params});
            setEqLibs(response.data);
        } catch (error) {
            console.error("Error fetching equip lib data:", error);
        }
    };

    // 설비LIB row 클릭 시 호출될 함수
    const handleEqLibClick = async (lib) => {
        // lib가 없으면 selectedEqLib를 빈 객체로 설정하고, 함수 종료
        if (!lib) {
            setSelectedEqLib({});
            setActves([]);
            return;
        }

        // lib가 있으면 selectedEqLib를 설정하고 API 호출
        setSelectedEqLib(lib);

        try {
            // 선택한 lib에 매핑된 활동자료 목록 조회
            const response = await axiosInstance.get(`/equip/actv/${lib.id}`);
            setActves(response.data);
        } catch (error) {
            console.error("Error fetching activity data:", error);
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

                // 기존 프로젝트에서 placeholderPjt를 제거하고 새 데이터를 병합
                setEqLibs(prevEqLibs => {
                    // placeholderProject 제거
                    const cleanedEqLibs = prevEqLibs.filter(eqLib => eqLib.id !== '');

                    // 새로 추가된 설비LIB을 병합
                    return [...cleanedEqLibs, response.data];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '설비LIB가 성공적으로 등록되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '설비LIB 등록에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
            Swal.fire(swalOptions);
        } else if (modalType === 'DeleteA') {
            try {
                // 선택된 설비LIB를 eqLib 리스트에서 제거
                setEqLibs(prevEqLibs => prevEqLibs.filter(eqLib => eqLib.id !== selectedEqLib.id));
                setSelectedEqLib({});
            } catch (error) {
                console.log(error);
            }
        } else if (modalType === 'FadAdd') {
            try {
                // data 배열을 순회하며 requestBody 배열 생성
                const requestBody = data.map(actv => ({
                    equipLibId: selectedEqLib.id,
                    actvDataId: actv.id,
                }));

                const response = await axiosInstance.post("/equip/libmap", requestBody);

                // 기존 활동자료에서 placeholderActv를 제거하고 새 데이터를 병합
                setActves(prevActves => {
                    // placeholderProject 제거
                    const cleanedActves = prevActves.filter(actv => actv.id !== '');

                    // 새로 추가된 설비LIB을 병합
                    return [...cleanedActves, ...response.data];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '활동자료가 성공적으로 지정되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '활동자료 지정에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'FlEdit') {
            try {
                const requestBody = {
                    id: selectedEqLib.id,
                    equipLibName: data.eqLibName,
                    equipDvs: data.eqDvs,
                    equipType: data.eqType,
                    equipSpecUnit: data.eqSpecUnit,
                };

                const response = await axiosInstance.patch("/equip/lib", requestBody);

                // 서버로부터 받은 수정된 데이터를 사용하여 리스트 업데이트
                setEqLibs(prevEqLibs => 
                    prevEqLibs.map(eqLib => 
                        eqLib.id === selectedEqLib.id ? response.data : eqLib
                    )
                );
                setSelectedEqLib({});

                swalOptions.title = '성공!',
                swalOptions.text = '설비LIB이 성공적으로 수정되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '설비LIB 수정에 실패하였습니다.';
                swalOptions.icon = 'success';
            }
        } else if (modalType === 'DeleteB') {
            try {
                // 선택된 활동자료를 actves 리스트에서 제거
                setActves(prevActves => prevActves.filter(actv => actv.id !== selectedActv.id));
                setSelectedActv({});
            } catch (error) {
                console.log(error);
            }
        }
        Swal.fire(swalOptions);
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 버튼 클릭 시 모달 열림 설정
    const onEqLibAddClick = () => {
        showModal('FlAdd');
    };

    const onEditClick = () => {
        showModal('FlEdit');
    };

    const onActvAddClick = () => {
        showModal('FadAdd');
    };

    const onEqLibDeleteClick = () => {
        showModal('DeleteA');
    };

    const onActvDeleteClick = () => {
        showModal('DeleteB');
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 설비 &gt; 설비 LIB 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />
            
            <div className={pdsStyles.main_grid}>
                <div className={pdsStyles.contents_container}>
                    <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                        <TableCustom 
                            title='설비LIB목록' 
                            data={eqLibs}                   
                            columns={equipLibColumns}
                            buttons={['Delete', 'Edit', 'Add']}
                            onClicks={[onEqLibDeleteClick, onEditClick, onEqLibAddClick]}
                            onRowClick={(e) => handleEqLibClick(e)}
                            selectedRows={[selectedEqLib]}
                            modals={[
                                {
                                    'modalType': 'DeleteA',
                                    'isModalOpen': isModalOpen.DeleteA,
                                    'handleOk': handleOk('DeleteA'),
                                    'handleCancel': handleCancel('DeleteA'),
                                    'rowData': selectedEqLib,
                                    'rowDataName': 'equipLibName',
                                    'url': '/equip'
                                },
                                {
                                    'modalType': 'FlEdit',
                                    'isModalOpen': isModalOpen.FlEdit,
                                    'handleOk': handleOk('FlEdit'),
                                    'handleCancel': handleCancel('FlEdit'),
                                    'rowData': selectedEqLib,
                                    'dropDown': formFields
                                },
                                {
                                    'modalType': 'FlAdd',
                                    'isModalOpen': isModalOpen.FlAdd,
                                    'handleOk': handleOk('FlAdd'),
                                    'handleCancel': handleCancel('FlAdd'),
                                    'dropDown': formFields
                                }
                            ]}
                        />
                    </Card>
                    <Card sx={{ width: "50%", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                        {(!actves || actves.length === 0) ?
                        <div className={pdsStyles.card_container}>
                            <div className={pdsStyles.table_title} style={{ padding: "8px" }}>활동자료목록</div>
                        </div> : (
                            <TableCustom 
                                title='활동자료목록' 
                                data={actves}
                                columns={equipActvColumns}   
                                buttons={['Delete', 'Add']}
                                onClicks={[onActvDeleteClick, onActvAddClick]}
                                onRowClick={handleActvClick}
                                selectedRows={[selectedActv]}
                                modals={[
                                    {
                                        'modalType': 'DeleteB',
                                        'isModalOpen': isModalOpen.DeleteB,
                                        'handleOk': handleOk('DeleteB'),
                                        'handleCancel': handleCancel('DeleteB'),
                                        'rowData': {
                                            ...selectedActv,
                                            equipLibId: selectedEqLib.id
                                        },
                                        'rowDataName': 'actvDataName',
                                        'url': '/equip/libmap'
                                    },
                                    {
                                        'modalType': 'FadAdd',
                                        'isModalOpen': isModalOpen.FadAdd,
                                        'handleOk': handleOk('FadAdd'),
                                        'handleCancel': handleCancel('FadAdd'),
                                        'rowData': selectedEqLib
                                    },
                                ]}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}