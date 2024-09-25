import React, { useState } from "react";
import { useRecoilState } from 'recoil';
import {
        managerState, empState, selectedManagerState, selectedEmpState,
    } from '../../../../atoms/pdsAtoms';
import {
        useHandleOkAction, useModalActions, useHandleSubmitAction,
        useSearchAction, useHandleKeyDownAction
    } from '../../../../actions/commonActions';
import { Input, Select } from 'antd';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@ant-design/icons';
import { AddButton } from '../../../../Button';
import { pjtManagerColumns, userColumns } from '../../../../assets/json/tableColumn';
import Table from "../../../../Table";
import TableCustom from "../../../../TableCustom";
import * as pdsStyles from "../../../../assets/css/pds.css";

const { Option } = Select;

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

export default function Pd({pjtId}) {                                                   // 선택된 사원의 loginId list
    const [managers, setManagers] = useRecoilState(managerState);                               // 조회 결과(담당자 목록)
    const [selectedManager, setSelectedManager] = useRecoilState(selectedManagerState);;        // 선택된 담당자
    const [emps, setEmps] = useRecoilState(empState);                                           // 조회 결과(사원 목록)
    const [selectedEmps, setSelectedEmps] = useRecoilState(selectedEmpState);                   // 선택된 사원의 loginId list
    const [inputEmpId, setInputEmpId] = useState('');                                     // 입력한 사번
    const [inputEmpName, setInputEmpName] = useState('');                                       // 입력한 사원명
    const [submittedMgrIdx, setSubmittedMgrIdx] = useState([]);

    const { showModal, closeModal, isModalOpen } = useModalActions();
    const handleOk = useHandleOkAction();
    const searchAction = useSearchAction();
    const submitAction = useHandleSubmitAction();
    const handleKeyDown = useHandleKeyDownAction();

    const handleSearch = () => {
        searchAction({
          url: `/pjt/not-manager?pjtId=${pjtId}&loginId=${inputEmpId}&userName=${inputEmpName}`,
          setter: setEmps,
        });
    };

    const handleSubmit = () => {
        setSubmittedMgrIdx([...Array(selectedEmps.length).keys()]) //등록된 현장담당자 수만큼의 인덱스 추출
        submitAction({
            data: selectedEmps,
            setterReg: setManagers,
            setterNotReg: setEmps,
            setterSelectedNotReg: setSelectedEmps,
            requestBody: selectedEmps.map(emp => ({
                pjtId: pjtId,
                userId: emp.id
            })),
            url: "/pjt/manager",
            successMsg: '담당자가 성공적으로 지정되었습니다.'
        })
    }

    // 담당자 클릭 시 호출될 함수
    const handleManagerClick = (manager) => {
        setSelectedManager(manager.row ?? {});
    };

    // 사원 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps(emp.row);
    };
  
    return (
        <>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                <TableCustom
                    title='현장담당자 목록' 
                    data={managers}
                    submittedRowIdx={submittedMgrIdx} 
                    columns={pjtManagerColumns}                 
                    buttons={['Delete']}
                    onClicks={[() => showModal('Delete')]}
                    onRowClick={handleManagerClick}
                    selectedRows={[selectedManager]}
                    modals={[
                        isModalOpen.Delete && {
                            modalType: 'Delete',
                            isModalOpen: isModalOpen.Delete,
                            handleOk: (params) => handleOk('Delete')({
                                ...params,
                                data: selectedManager, 
                                setter: setManagers, 
                                setterSumittedIdx: setSubmittedMgrIdx
                            }),
                            handleCancel: closeModal('Delete'),
                            rowData: selectedManager,
                            rowDataName: 'userName',
                            url: '/pjt/manager'
                        },
                    ]}
                />
            </Card>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                <div className={pdsStyles.card_container}>
                    <div className={pdsStyles.contents_header}>
                        현장담당자 등록
                        {(emps.length === 0 ? 
                            <></> :
                            <AddButton onClick={handleSubmit} disabled={selectedEmps.length === 0} />
                        )}
                    </div>
                    <div className={pdsStyles.search_container}>
                        <div className={pdsStyles.search_item}>
                            <div className={pdsStyles.search_title}>사번</div>
                            <CustomInput
                                value={inputEmpId}
                                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                onChange={(e) => setInputEmpId(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, handleSearch)}
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
                                    onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                                    style={{ width: '12rem', backgroundColor: '#E5F1E4', outline: 'none', boxShadow: 'none' }}
                                />
                                <button className={pdsStyles.search_button} onClick={handleSearch}>조회</button>
                            </div>
                        </div>
                    </div>

                    <div className={pdsStyles.result_container}>
                        {(!emps || emps.length === 0) ? 
                        <></> : <Table key={JSON.stringify(managers.length)} data={emps} columns={userColumns} variant='checkbox' onRowClick={handleEmpClick} modalPagination={true} />
                        }
                    </div>
                </div>
            </Card>
        </>
    )
};