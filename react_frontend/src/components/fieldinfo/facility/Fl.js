import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { eqLibSearchForm } from '../../../atoms/searchFormAtoms';
import Swal from 'sweetalert2';
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
    const [formData, setFormData] = useRecoilState(eqLibSearchForm);
    const [eqLibs, setEqLibs] = useState([]);
    const [selectedEqLib, setSelectedEqLib] = useState({});     // 선택된 설비 LIB
    const [actves, setActves] = useState([]);
    const [selectedActv, setSelectedActv] = useState({});
    const [selectedEqLibIdx, setSelectedEqLibIdx] = useState([]);
    const [selectedActvIdx, setSelectedActvIdx] = useState([]);
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

        // formData값이 없으면 설비LIB을 findAll, 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        Object.keys(formData).length === 0 ? fetchEqLib() : handleFormSubmit(formData);
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
            setActves([]);
            setFormData(data);
        } catch (error) {
            console.error("Error fetching equip lib data:", error);
        }
    };

    // 설비LIB row 클릭 시 호출될 함수
    const handleEqLibClick = async (data) => {
        const lib = data.row;

        // lib가 없으면 selectedEqLib를 빈 객체로 설정하고, 함수 종료
        if (!lib) {
            setSelectedEqLib({});
            setActves([]);
            return;
        } else {
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

    }

    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (actv) => {
        setSelectedActv(actv.row ?? {});
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

                setEqLibs(prevEqLibs => [response.data, ...prevEqLibs]);
                setSelectedEqLib({});
                setSelectedEqLibIdx([0]);

                swalOptions.title = '성공!',
                swalOptions.text = `${data.eqLibName}(이)가 성공적으로 등록되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message;
                swalOptions.icon = 'error';
            }
            Swal.fire(swalOptions);
<<<<<<< HEAD
=======
        } else if (modalType === 'DeleteA') {
            try {
                // 선택된 설비LIB를 eqLib 리스트에서 제거
                setEqLibs(prevEqLibs => prevEqLibs.filter(eqLib => eqLib.id !== selectedEqLib.id));
                setSelectedEqLib({});
            } catch (error) {
                console.log(error);
            }
        } else if (modalType === 'FadAdd') {
            const newFads = data.row;

            try {
                // data 배열을 순회하며 requestBody 배열 생성
                const requestBody = newFads.map(actv => ({
                    equipLibId: selectedEqLib.id,
                    actvDataId: actv.id,
                }));

                const response = await axiosInstance.post("/equip/libmap", requestBody);

                // 기존 활동자료에서 placeholderActv를 제거하고 새 데이터를 병합
                setActves(prevActves => [...prevActves, ...response.data]);

                swalOptions.title = '성공!',
                swalOptions.text = `${data.actvDataName}(이)가 성공적으로 지정되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message;
                swalOptions.icon = 'error';
            }
>>>>>>> 7216d1e180cbc03325dee360e53e41510aea25d7
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

                swalOptions.title = '성공!',
<<<<<<< HEAD
                swalOptions.text = `${selectedEqLib.equipLibName}(이)가 성공적으로 수정되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message;
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'DeleteA') {
            try {
                // 선택된 설비LIB를 eqLib 리스트에서 제거
                setEqLibs(prevEqLibs => prevEqLibs.filter(eqLib => eqLib.id !== selectedEqLib.id));
                setSelectedEqLib({});
                setSelectedEqLibIdx([]);
            } catch (error) {
                console.log(error);
            }
        } else if (modalType === 'FadAdd') {
            const newFads = data.row;
            const actvDataNameList = [];

            try {
                // data 배열을 순회하며 requestBody 배열 생성
                const requestBody = newFads.map(actv => {
                    actvDataNameList.push(actv.actvDataName);  // actvDataName을 리스트에 추가
                    return {
                        equipLibId: selectedEqLib.id,
                        actvDataId: actv.id
                    };
                });
                const response = await axiosInstance.post("/equip/libmap", requestBody);

                // 기존 활동자료에서 새 데이터를 병합
                setActves(prevActves => [...response.data, ...prevActves]);
                setSelectedActv({});
                setSelectedActvIdx([...Array(newFads.length).keys()]) //지정된 활동자료 만큼의 인덱스 추출(3개(n)를 지정했으면 [0, 1, 2(n-1)] 배열을 만듦)

                swalOptions.title = '성공!',
                swalOptions.text = `${actvDataNameList.join(', ')}(이)가 성공적으로 지정되었습니다.`;
=======
                swalOptions.text = `${data.eqLibName}(이)가 성공적으로 수정되었습니다.`;
>>>>>>> 7216d1e180cbc03325dee360e53e41510aea25d7
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message;
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'DeleteB') {
            try {
                // 선택된 활동자료를 actves 리스트에서 제거
                setActves(prevActves => prevActves.filter(actv => actv.id !== selectedActv.id));
                setSelectedActv({});
                setSelectedActvIdx([]);
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

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 설비 &gt; 설비 LIB 관리</div>
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formFields} 
            />
            
            <div className={pdsStyles.main_grid}>
                <div className={pdsStyles.contents_container}>
                    <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                        <TableCustom 
                            title='설비LIB목록' 
                            data={eqLibs}
                            selectedRowIdx={selectedEqLibIdx}     
                            columns={equipLibColumns}
                            buttons={['Delete', 'Edit', 'Add']}
                            onClicks={[() => showModal('DeleteA'), () => showModal('FlEdit'), () => showModal('FlAdd')]}
                            onRowClick={(e) => handleEqLibClick(e)}
                            selectedRows={[selectedEqLib]}
                            keyProp={eqLibs.length}
                            modals={[
                                {
                                    'modalType': 'DeleteA',
                                    'isModalOpen': isModalOpen.DeleteA,
                                    'handleOk': handleOk('DeleteA'),
                                    'handleCancel': handleCancel('DeleteA'),
                                    'rowData': selectedEqLib,
                                    'rowDataName': 'equipLibName',
                                    'url': '/equip/lib'
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
                        {(!selectedEqLib || Object.keys(selectedEqLib).length === 0) ?
                        <div className={pdsStyles.card_container}>
                            <div className={pdsStyles.table_title} style={{ padding: "8px" }}>활동자료목록</div>
                        </div> : (
                            <TableCustom 
                                title='활동자료목록' 
                                data={actves}
                                selectedRowIdx={selectedActvIdx}  
                                columns={equipActvColumns}   
                                buttons={['Delete', 'Add']}
                                onClicks={[() => showModal('DeleteB'), () => showModal('FadAdd')]}
                                onRowClick={handleActvClick}
                                selectedRows={[selectedActv]}
                                keyProp={actves.length}
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