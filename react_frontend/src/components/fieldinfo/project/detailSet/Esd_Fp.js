import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import { emissionSrcSearchForm } from '../../../../atoms/searchFormAtoms';
import {
    emSourceState, selectedESState, suppDocState, selectedSuppDocState, filteredSDState
    } from '../../../../atoms/pdsAtoms';
import {
        useHandleOkAction, useModalActions
    } from '../../../../actions/commonActions';
import axiosInstance from '../../../../utils/AxiosInstance';
import SearchForms from "../../../../SearchForms";
import { Input, Select } from 'antd';
import { Card, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { equipEmissionColumns, equipDocumentColumns } from '../../../../assets/json/tableColumn';
import { formField_esm_fp } from "../../../../assets/json/searchFormData";
import TableCustom from "../../../../TableCustom";
import * as pdsStyles from "../../../../assets/css/pds.css";
import  * as mainStyles from '../../../../assets/css/main.css';

const CustomInput = styled(Input)`
    background-color: transparent !important;

    &:focus, &:hover, &.ant-input-focused, &:focus-within {
        outline: none;
        box-shadow: 0 0 0 0.5px #0EAA00 !important;
        border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }

    input {
        &:focus {
            box-shadow: none !important;
            border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }
`;

const CustomSelect = styled(Select)`
    .ant-select-selector {
        background-color: transparent !important;
        border-color: #D9D9D9 !important;
        transition: border-color 0.3s;

        &:hover {
            border-color: #0EAA00 !important;
        }

        &:focus, &:focus-within {
            outline: none;
            box-shadow: 0 0 0 0.5px #0EAA00 !important;
            border-color: #0EAA00 !important;
        }
    }

    .ant-select-selection-item {
        &:hover {
            border-color: #0EAA00 !important;
        }
    }
`;

const CustomButton = styled(Button)(({ selected }) => ({
    color: selected ? '#000' : '#B6B6B6',
    border: selected ? '0.1rem solid #0A7800' : 'none',
    backgroundColor: selected ? '#fff' : 'transparent',
    fontWeight: selected ? 'bolder' : 'normal',
    borderRadius: '1.3rem',
    fontSize: '1rem',
    paddingTop: '0.1rem',
    paddingBottom: '0.1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',

    '&:hover': {
        color: '#000',
        backgroundColor: '#fff',
        border: '0.1rem solid #0A7800',
        borderRadius: '1.3rem',
        fontWeight: 'bolder',
    },
}));

export default function Esd_Fp() {
    const [formFields, setFormFields] = useState(formField_esm_fp);
    const [formData, setFormData] = useRecoilState(emissionSrcSearchForm);
    const [selectedPjt, setSelectedPjt] = useState({});                 // 선택된 프로젝트
    const [emSources, setEmSources] = useRecoilState(emSourceState);
    const [selectedES, setSelectedES] = useRecoilState(selectedESState);
    const [suppDocs, setSuppDocs] = useRecoilState(suppDocState);
    const [filteredSDs, setFilteredSDs] = useRecoilState(filteredSDState);
    const [selectedSD, setSelectedSD] = useRecoilState(selectedSuppDocState);
    const [year, setYear] = useState(new Date().getFullYear());

    const { showModal, closeModal, isModalOpen } = useModalActions();
    const handleOk = useHandleOkAction();

    // 프로젝트 드롭다운 옵션 설정
    const [pjtOptions, setPjtOptions] = useState([]);
    const [projectData, setProjectData] = useState([]);  // 전체 프로젝트 데이터를 저장
    useEffect(() => {
        const fetchPjtOptions = async () => {
            try {
                const res = await axiosInstance.get("/pjt/my");
                setProjectData(res.data);  // 전체 프로젝트 데이터를 저장
                const options = res.data.map(pjt => ({
                    value: pjt.pjtId,  // value에 id만 전달
                    label: pjt.pjtCode +"/"+ pjt.pjtName,
                }));
                setPjtOptions(options);
                const updateFormFields = formFields.map(field =>
                    field.name === 'searchProject' ? { ...field, options } : field
                );

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPjtOptions();

        // 이전 탭의 검색기록이 있으면 그 값을 불러옴
        Object.keys(formData).length !== 0 && handleFormSubmit(formData);
    }, []);

    const fetchSDList = async (es) => {
        try {
            // 선택한 배출원에 매핑된 증빙자료 목록 조회
            const response = await axiosInstance.get(`/equip/document?emissionId=${es.id}`);
            setSuppDocs(response.data);
            setFilteredSDs(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        try {
            const pjtRes = await axiosInstance.get(`/pjt?pgmsYn=y&id=${data.searchProject}`);
            const emRes = await axiosInstance.get(`/equip/emission?projectId=${data.searchProject}`);
           
            if(Object.keys(selectedES).length !== 0) {
                fetchSDList(selectedES);
            }

            setSelectedPjt(pjtRes.data[0]);
            setEmSources(emRes.data);
            setFormData(data);
        } catch (error) {
            console.error(error);
        }
    };

    // 배출원 row 클릭 시 호출될 함수
    const handleESClick = async (data) => {
        const es = data.row;
        
        if (!es) {
            setSelectedES({});
            setSuppDocs([]);
            setFilteredSDs([]);
            return;
        }

        // 배출원을 클릭하면 setSelectedES를 설정하고 API 호출
        setSelectedES(es);
        fetchSDList(es);
    };

    // 증빙자료 row 클릭 시 호출될 함수
    const handleSDClick = (sd) => {
        setSelectedSD(sd.row ?? {});
    };

    const handleYearChange = (year) => {
        setYear(year);
        const filteredResult = suppDocs.filter((sd) => sd.actvYear === year);
        setFilteredSDs(filteredResult);
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 상세설정</div>
            <SearchForms 
                initialValues={formData}
                onFormSubmit={handleFormSubmit} 
                formFields={formFields} 
            />
            {(Object.keys(formData).length === 0) ?
                <></> :
                <div className={pdsStyles.main_grid}>
                    <Card sx={{ height: "auto", padding: "0.5rem", borderRadius: "0.5rem" }}>
                        <div className={pdsStyles.table_title} style={{ padding: "0 1rem"}}>프로젝트 상세정보</div>

                        <div className={pdsStyles.row} style={{ padding: "0.5rem 1rem"}}>
                            <div className={pdsStyles.pjt_data_container}>프로젝트 지역
                                <div className={pdsStyles.code}>{selectedPjt.pjtType} / {selectedPjt.regCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>계약일
                                <div className={pdsStyles.code}>{selectedPjt.ctrtFrYear} / {selectedPjt.ctrtFrMth} ~ {selectedPjt.ctrtToYear} / {selectedPjt.ctrtToMth}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>본부명
                                <div className={pdsStyles.code}>{selectedPjt.divCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>연면적(m²)
                                <div className={pdsStyles.code}>{selectedPjt.bldArea}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>진행상태
                                <div className={pdsStyles.code}>{selectedPjt.pjtProgStus}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>분류
                                <div className={pdsStyles.code}>{selectedPjt.prodTypeCode}</div>
                            </div>
                        </div>
                    </Card>

                    <div className={pdsStyles.button_container}>
                        <CustomButton
                            variant="outlined"
                            selected={true}
                        >
                            배출원 관리
                        </CustomButton>
                    </div>
                        
                    <div className={pdsStyles.contents_container}>
                        <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                            <TableCustom
                                title='배출원목록' 
                                data={emSources}
                                columns={equipEmissionColumns}                 
                                buttons={['Delete', 'Add']}
                                onClicks={[() => showModal('DeleteA'), () => showModal('EsmAdd')]}
                                onRowClick={handleESClick}
                                selectedRows={[selectedES]}
                                keyProp={emSources.length}
                                modals={[
                                    isModalOpen.DeleteA && {
                                        modalType: 'DeleteA',
                                        isModalOpen: isModalOpen.DeleteA,
                                        handleOk: (params) => handleOk('DeleteA')({
                                            ...params,
                                            data: selectedES, 
                                            setter: setEmSources,
                                            setterSelected: setSelectedES
                                        }),
                                        handleCancel: closeModal('DeleteA'),
                                        rowData: selectedES,
                                        rowDataName: 'equipName',
                                        url: '/equip/emission'
                                    },
                                    isModalOpen.EsmAdd && {
                                        modalType: 'EsmAdd',
                                        isModalOpen: isModalOpen.EsmAdd,
                                        handleOk: (params) => handleOk('EsmAdd')({
                                            ...params,
                                            setter: setEmSources, 
                                            setterSelected: setSelectedES
                                        }),
                                        handleCancel: closeModal('EsmAdd'),
                                        rowData: selectedPjt.id
                                    },
                                ]}
                            />
                        </Card>
                        <Card sx={{ width: "50%", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                            {(!selectedES || Object.keys(selectedES).length === 0) ?
                            <div className={pdsStyles.card_container}>
                                <div className={pdsStyles.table_title} style={{ padding: "8px" }}>증빙자료목록</div>
                            </div> : (
                                <TableCustom 
                                    title='증빙자료목록' 
                                    data={filteredSDs} 
                                    columns={equipDocumentColumns}
                                    buttons={['ShowDetails', 'Delete', 'Add']}
                                    onClicks={[() => showModal('SdShowDetails'), () => showModal('DeleteB'), () => showModal('SdAdd')]}
                                    onRowClick={handleSDClick}
                                    selectedRows={[selectedSD]}
                                    handleYearChange={handleYearChange}
                                    year={year}
                                    modals={[
                                        isModalOpen.SdShowDetails && {
                                            modalType: 'SdShowDetails',
                                            isModalOpen: isModalOpen.SdShowDetails,
                                            handleOk: () => handleOk('SdShowDetails') ({
                                                data: selectedSD, 
                                                setter: setFilteredSDs, 
                                                setterSelected: setSelectedSD
                                            }),
                                            handleCancel: closeModal('SdShowDetails'),
                                            rowData: selectedSD
                                        },
                                        isModalOpen.DeleteB && {
                                            modalType: 'DeleteB',
                                            isModalOpen: isModalOpen.DeleteB,
                                            handleOk: (params) => handleOk('DeleteB')({
                                                ...params,
                                                data: selectedSD, 
                                                setter: setFilteredSDs, 
                                                setterSelected: setSelectedSD
                                            }),
                                            handleCancel: closeModal('DeleteB'),
                                            rowData: selectedSD,
                                            rowDataName: 'name',
                                            url: '/equip/document'
                                        },
                                        isModalOpen.SdAdd && {
                                            modalType: 'SdAdd',
                                            isModalOpen: isModalOpen.SdAdd,
                                            handleOk: (params) => handleOk('SdAdd')({
                                                ...params,
                                                setter: setFilteredSDs, 
                                                setterSelected: setSelectedSD
                                            }),
                                            handleCancel: closeModal('SdAdd'),
                                            rowData: selectedES
                                        },
                                    ]}
                                />
                            )}
                        </Card>
                    </div>
                </div>
            }
        </>
    );
};