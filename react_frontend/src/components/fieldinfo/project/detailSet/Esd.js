import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import {
    emSourceState, selectedESState, suppDocState, selectedSuppDocState, filteredSDState
    } from '../../../../atoms/pdsAtoms';
import {
        useHandleOkAction, useModalActions
    } from '../../../../actions/commonActions';
import axiosInstance from '../../../../utils/AxiosInstance';
import { Input, Select } from 'antd';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@ant-design/icons';
import { equipColumns, equipEmissionColumns, equipDocumentColumns } from '../../../../assets/json/tableColumn';
import Table from "../../../../Table";
import TableCustom from "../../../../TableCustom";
import * as pdsStyles from "../../../../assets/css/pds.css";

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

export default function Esd({pjtId}) {
    const [emSources, setEmSources] = useRecoilState(emSourceState);
    const [selectedES, setSelectedES] = useRecoilState(selectedESState);
    const [suppDocs, setSuppDocs] = useRecoilState(suppDocState);
    const [filteredSDs, setFilteredSDs] = useState(filteredSDState);
    const [selectedSD, setSelectedSD] = useRecoilState(selectedSuppDocState);
    const [year, setYear] = useState(new Date().getFullYear());
    const [submittedEsdIdx, setSubmittedEsdIdx] = useState([]);
    const [submittedSDIdx, setSubmittedSDIdx] = useState([]);

    const { showModal, closeModal, isModalOpen } = useModalActions();
    const handleOk = useHandleOkAction();

    useEffect(() => {
        Object.keys(selectedES).length !== 0 && fetchSDList(selectedES);
    }, []);

    useEffect(() => {
        setSelectedSD({});
    }, [selectedES])

    const fetchSDList = async (es) => {
        try {
            // 선택한 배출원에 매핑된 증빙자료 목록 조회
            const response = await axiosInstance.get(`/equip/document?emissionId=${es.id}`);
            setSuppDocs(response.data);
            setFilteredSDs(response.data);
        } catch (error) {
            console.error("Error fetching activity data:", error);
        }
    }

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
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                <TableCustom
                    title='배출원 목록' 
                    data={emSources}
                    submittedRowIdx={submittedEsdIdx}
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
                                setterSelected: setSelectedES,
                                setterSumittedIdx: setSubmittedEsdIdx
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
                                setterSelected: setSelectedES,
                                setterSumittedIdx: setSubmittedEsdIdx
                            }),
                            handleCancel: closeModal('EsmAdd'),
                            rowData: pjtId
                        },
                    ]}
                />
            </Card>
            <Card sx={{ width: "50%", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                {(!selectedES || Object.keys(selectedES).length === 0) ?
                <div className={pdsStyles.card_container}>
                    <div className={pdsStyles.table_title} style={{ padding: "8px" }}>증빙자료 목록</div>
                </div> : (
                    <TableCustom 
                        title='증빙자료 목록' 
                        data={filteredSDs} 
                        submittedRowIdx={submittedSDIdx}
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
                                handleOk: (params) => handleOk('SdShowDetails') ({
                                    ...params,
                                    data: selectedSD, 
                                    setter: setFilteredSDs, 
                                    setterSelected: setSelectedSD,
                                    setterSumittedIdx: setSubmittedSDIdx
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
                                    setterSelected: setSelectedSD,
                                    setterSumittedIdx: setSubmittedSDIdx
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
                                    setterSelected: setSelectedSD,
                                    setterSumittedIdx: setSubmittedSDIdx
                                }),
                                handleCancel: closeModal('SdAdd'),
                                rowData: selectedES
                            },
                        ]}
                        monthPagination={true}
                    />
                )}
            </Card>
        </>
    );
};