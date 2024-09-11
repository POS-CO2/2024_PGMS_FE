import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import {
    eqState, selectedEqState, eqLibState, selectedEqLibState
    } from '../../../../atoms/pdsAtoms';
import {
        useHandleOkAction, useModalActions, useHandleSubmitAction,
        useSearchAction, useHandleKeyDownAction
    } from '../../../../actions/commonActions';
import axiosInstance from '../../../../utils/AxiosInstance';
import { Input, Select } from 'antd';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@ant-design/icons';
import { AddButton } from '../../../../Button';
import { equipColumns } from '../../../../assets/json/tableColumn';
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

export default function Fd({pjtId}) {
    const [equips, setEquips] = useRecoilState(eqState);
    const [selectedEq, setSelectedEq] = useRecoilState(selectedEqState);
    const [eqLibs, setEqLibs] = useRecoilState(eqLibState);
    const [selectedEqLib, setSelectedEqLib] = useRecoilState(selectedEqLibState);

    // 드롭다운 리스트
    const [eqTypeList, setEqTypeList] = useState([]);
    const [eqDvsList, setEqDvsList] = useState([]);    

    // 서치폼, 등록창 상태 관리
    const [inputEqLib, setInputEqLib] = useState('');
    const [inputEqType, setInputEqType] = useState('');
    const [inputEqDvs, setInputEqDvs] = useState('');
    const [inputEqName, setInputEqName] = useState('');

    const { showModal, closeModal, isModalOpen } = useModalActions();
    const handleOk = useHandleOkAction();
    const searchAction = useSearchAction();
    const submitAction = useHandleSubmitAction();
    const handleKeyDown = useHandleKeyDownAction();

    // 설비유형 및 설비구분 데이터를 불러오는 함수
    const fetchDropdownOptions = async () => {
        try {
            const typeResponse = await axiosInstance.get(`/sys/unit?unitType=설비유형`);
            const dvsResponse = await axiosInstance.get(`/sys/unit?unitType=설비구분`);
            
            const optionsType = typeResponse.data.map(item => ({
                value: item.code,
                label: item.name,
            }));

            const optionsDvs = dvsResponse.data.map(item => ({
                value: item.code,
                label: item.name,
            }));

            setEqTypeList(optionsType);  // 설비유형 리스트 설정
            setEqDvsList(optionsDvs);    // 설비구분 리스트 설정
        } catch (error) {
            console.error("Error fetching dropdown data: ", error);
        }
    };

    useEffect(() => {
        fetchDropdownOptions();  // 컴포넌트가 마운트될 때 드롭다운 리스트 데이터를 가져옴
    }, []);

    useEffect(() => {
        if(Object.keys(selectedEqLib).length === 0) {
            setInputEqName('');
        } else {
            setInputEqName(selectedEqLib.equipLibName);
        }
    }, [selectedEqLib]);

    const handleSearch = () => {
        const params = {
            equipLibName: inputEqLib,
            equipDvs: inputEqDvs === '' ? null : inputEqDvs,
            equipType: inputEqType === '' ? null : inputEqType,
        };

        searchAction({
          url: "/equip/lib",
          setter: setEqLibs,
          params: params
        });
    };

    const handleSubmit = () => {
        submitAction({
            data: selectedEqLib,
            setterReg: setEquips,
            setterNotReg: setEqLibs,
            setterSelectedNotReg: setSelectedEqLib,
            requestBody: {
                pjtId: pjtId,
                equipLibId: selectedEqLib.id,
                equipName: inputEqName
            },
            url: "/equip",
            successMsg: `${inputEqName}(이)가 성공적으로 지정되었습니다.`
        })
    }

    // 설비 row 클릭 시 호출될 함수
    const handleEqClick = (eq) => {
        setSelectedEq(eq ?? {});
    };

    // 설비LIB row 클릭 시 호출될 함수
    const handleNotEqClick = (eq) => {
        setSelectedEqLib(eq ?? {});
    };

    const handleExcelUploadClick = (csvData, fileName) => {
        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성
        const headers = Object.keys(csvData[0]);
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        // CSV 파일 생성
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                <TableCustom
                    title='설비목록' 
                    data={equips}
                    columns={equipColumns}                 
                    buttons={['Delete', 'DownloadExcel']}
                    onClicks={[() => handleExcelUploadClick(equips, 'exported_table'), () => showModal('Delete')]}
                    onRowClick={handleEqClick}
                    selectedRows={[selectedEq]}
                    modals={[
                        {
                            modalType: 'Delete',
                            isModalOpen: isModalOpen.Delete,
                            handleOk: () => handleOk('Delete') ({
                                data: selectedEq, 
                                setter: setEquips, 
                                setterSelected: setSelectedEq
                            }),
                            handleCancel: closeModal('Delete'),
                            rowData: selectedEq,
                            rowDataName: 'equipName',
                            url: '/equip'
                        },
                    ]}
                />
            </Card>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                <div className={pdsStyles.card_container}>
                    <div className={pdsStyles.contents_header}>
                        설비등록
                        <AddButton onClick={handleSubmit} disabled={Object.keys(selectedEqLib).length === 0} />
                    </div>
                    <div className={pdsStyles.search_container}>
                        <div className={pdsStyles.search_item}>
                            <div className={pdsStyles.search_title}>설비LIB명</div>
                            <CustomInput
                                value={inputEqLib}
                                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                onChange={(e) => setInputEqLib(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                                style={{ width: '8rem' }}
                            />
                        </div>
                        <div className={pdsStyles.search_item}>
                            <div className={pdsStyles.search_title}>설비유형</div>
                            <CustomSelect
                                value={inputEqType}
                                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                onChange={(value) => setInputEqType(value)}
                                style={{ width: '12.3rem' }}
                            >
                                {eqTypeList.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </CustomSelect>
                        </div>
                        <div className={pdsStyles.search_item}>
                            <div className={pdsStyles.search_title}>설비구분</div>
                            <div className={pdsStyles.input_with_btn}>
                                <CustomSelect
                                    value={inputEqDvs}
                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                    onChange={(value) => setInputEqDvs(value)}
                                    style={{ width: '7rem' }}
                                >
                                    {eqDvsList.map((option) => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </CustomSelect>
                                <button className={pdsStyles.search_button} onClick={handleSearch} style={{ width: '3rem' }}>조회</button>
                            </div>
                        </div>
                    </div>

                    <div className={pdsStyles.result_container}>
                        <Table key={JSON.stringify(equips.length)} data={eqLibs} columns={equipColumns} onRowClick={handleNotEqClick} modalPagination={true} />
                        
                        <div className={pdsStyles.input_container} style={{ padding: '0.5rem', marginBottom: "1rem", marginTop: '20px' }}>
                            <div className={pdsStyles.search_title} style={{ marginRight: '0.2rem' }}>
                                <span style={{ color: 'red', position: 'relative', top: '-0.2rem' }}>*</span>
                                등록할 설비명
                            </div>
                            <CustomInput
                                value={inputEqName}
                                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                onChange={(e) => setInputEqName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};