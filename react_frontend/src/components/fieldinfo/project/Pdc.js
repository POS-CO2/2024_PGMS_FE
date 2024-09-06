import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Input, Select } from 'antd';
import { Card, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@ant-design/icons';
import { pjtManagerColumns, equipColumns, equipEmissionColumns, userColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import SearchProjectModal from "../../../FormItem/SearchProjectModal";
import * as pdsStyles from "../../../assets/css/pds.css";
import * as mainStyles from "../../../assets/css/main.css";
import selectedPjt from "../../../assets/json/selectedPjt";

const { Option } = Select;

const CustomButton = styled(Button)(({ theme, selected }) => ({
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

export default function Pdc(pjtId, selectedButton, onDeleteClick, isModalOpen, handleOk, handleCancel) {
    const [managers, setManagers] = useState([]);                               // 조회 결과(담당자 목록)
    const [selectedManager, setSelectedManager] = useState({});                 // 선택된 담당자
    const [emps, setEmps] = useState([]);                                       // 조회 결과(사원 목록)
    const [selectedEmps, setSelectedEmps] = useState([]);                       // 선택된 사원의 loginId list
    const [inputEmpId, setInputEmpId] = useState('');                           // 입력한 사번
    const [inputEmpName, setInputEmpName] = useState('');                       // 입력한 사원명

    useEffect(async () => {
        const response = await axiosInstance.get(`/pjt/manager?pjtId=${pjtId}`);
        setManagers(response.data);
    }, []);

    // 사원 row 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps(emp);
    };

    // 담당자 row 클릭 시 호출될 함수
    const handleManagerClick = (manager) => {
        setSelectedManager(manager ?? {});
    };

    return (
        <>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                <TableCustom
                    title='담당자목록' 
                    data={managers}
                    columns={pjtManagerColumns}                 
                    buttons={['Delete']}
                    onClicks={[onDeleteClick]}
                    onRowClick={handleManagerClick}
                    selectedRows={[selectedManager]}
                    modals={[
                        {
                            'modalType': 'Delete',
                            'isModalOpen': isModalOpen.Delete,
                            'handleOk': handleOk('Delete', selectedButton),
                            'handleCancel': handleCancel('Delete'),
                            'rowData': selectedManager,
                            'rowDataName': 'userName',
                            'url': '/pjt/manager'
                        },
                    ]}
                />
            </Card>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                <div className={pdsStyles.card_container}>
                    <div className={pdsStyles.table_title}>현장 담당자 지정</div>
                    <div className={pdsStyles.search_container}>
                        <div className={pdsStyles.search_item}>
                            <div className={pdsStyles.search_title}>사번</div>
                            <CustomInput
                                value={inputEmpId}
                                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                onChange={(e) => setInputEmpId(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ width: '12rem', backgroundColor: '#E5F1E4', outline: 'none', boxShadow: 'none' }}
                            />
                        </div>
                        <div className={pdsStyles.search_item}>
                            <div className={pdsStyles.search_title}>이름</div>
                            <div className={pdsStyles.input_with_btn}>
                                <CustomInput
                                    value={inputEmpName}
                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                    onChange={(e) => setInputEmpName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    style={{ width: '12rem', backgroundColor: '#E5F1E4', outline: 'none', boxShadow: 'none' }}
                                />
                                <button className={pdsStyles.search_button} onClick={handleSearch}>조회</button>
                            </div>
                        </div>
                    </div>

                    <div className={pdsStyles.result_container}>
                        {(!emps || Object.keys(emps).length === 0) ? 
                        <></> : <Table key={JSON.stringify(managers.length)} data={emps} columns={userColumns} variant='checkbox' onRowClick={handleEmpClick} modalPagination={true} />
                        }
                        {(!selectedEmps || selectedEmps.length === 0) ?
                        <></> : ( <button className={pdsStyles.select_button} onClick={() => handleSelect(selectedEmps, setManagers, setEmps, setSelectedManager)}>등록</button> )}
                    </div>
                </div>
            </Card>
        </>
    )
};