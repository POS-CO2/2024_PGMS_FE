import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_um } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_um_list } from '../../assets/json/selectedPjt';
import { ButtonGroup, ButtonGroupMm } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, TextField, Button } from '@mui/material';
import { Dropdown } from '@mui/base';

export default function Um() {

    const [userList, setUserList] = useState([]);

    const handleFormSubmit = (data) => {
        setUserList(data);
    }

    const [infoShow ,setInfoShow] = useState(false);

    const access = [
        {
            value: 'None',
            label: 'None'
        },
        {
            value: '현장담당자',
            label: '현장담당자'
        },
        {
            value: '본사담당자',
            label: '본사담당자'
        },
        {
            value: '시스템관리자',
            label: '시스템관리자'
        },
    ]

    const [selectedUser, setSelectedUser] = useState(
        {
            loginId: '',
            userName: '',
            branch: '',
            access: 'ADMIN',
        }
    );

    const handleRowClick = (e) => {
        setInfoShow(true);
        const newUserInfo = {
            loginId: e['로그인 아이디'],
            userName: e['이름'],
            branch: e['사업장'],
            access: 'ADMIN'
        }

        setSelectedUser(
            newUserInfo
        );
        
    };

    const [isModalOpen, setIsModalOpen] = useState({
        Delete: false,
        UmAdd: false,
    });

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({...prevState, [modalType]: true}));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    }; 

    const handleAddClick = () => {
        showModal('UmAdd');
    }

    const [editable, setEditable] = useState(true);
    
    const handleEditClick = () => {
        setEditable(!editable);
    }

    const handleDeleteClick = () => {
        showModal('Delete');
    }

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 사용자 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_um}/>
            <div className={sysStyles.main_grid}>
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh"}}>
                    <div className={sysStyles.mid_title}>{"사용자 목록"}</div>
                    <TableCustom title="" data={table_um_list} button="" onRowClick={(e) => handleRowClick(e)}/>
                </Card>
                <Card className={sysStyles.card_box} sx={{width:"50%"}}>
                    <div className={sysStyles.mid_title}>{"사용자 상세 정보"}</div>
                    
                    {infoShow ? (
                        <>
                            <TableCustom title='' buttons={['Add', 'Delete', 'Edit']} onClicks={[handleAddClick, handleDeleteClick, handleEditClick]} table={false} modals={
                                [
                                    {
                                        "modalType" : 'UmAdd',
                                        'isModalOpen': isModalOpen.UmAdd,
                                        'handleOk': handleOk('UmAdd'),
                                        'handleCancel': handleCancel('UmAdd')
                                    },
                                    {
                                        "modalType" : 'Delete',
                                        'isModalOpen': isModalOpen.Delete,
                                        'handleOk': handleOk('Delete'),
                                        'handleCancel': handleCancel('Delete')
                                    },
                                ]
                            }/>
                            <div className={sysStyles.card_box}>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>
                                    {"로그인 아이디"}
                                </div>
                                {!editable ? (
                                    <TextField id='loginId' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.loginId} value={selectedUser.loginId} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='loginId' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.loginId} value={selectedUser.loginId} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                                
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"이름 "}</div>
                                {!editable ? (
                                    <TextField id='userName' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.userName} value={selectedUser.userName} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='userName' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.userName} value={selectedUser.userName} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"사업장"}</div>
                                {!editable ? (
                                    <TextField id='branchName' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.branch} value={selectedUser.branch} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='branchName' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.branch} value={selectedUser.branch} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                                
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"권한"}</div>
                                {!editable ? (
                                    <TextField
                                        id="outlined-select-currency-native"
                                        select
                                        disabled={editable}
                                        defaultValue="ADMIN"
                                        value={"ADMIN"}
                                        SelectProps={{
                                            native: true,
                                        }}
                                        sx={{width:"100%"}}
                                        >
                                        {access.map((option) => (
                                            <option key={option.value} value={option.value} onChange={(e) => setSelectedUser(e.target.value)} >
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        id="outlined-select-currency-native"
                                        select
                                        disabled={editable}
                                        defaultValue="None"
                                        value={"ADMIN"}
                                        SelectProps={{
                                            native: true,
                                        }}
                                        sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}
                                        >
                                        {access.map((option) => (
                                            <option key={option.value} value={option.value} onChange={(e) => setSelectedUser(e.target.value)} >
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
                                )}
                            </div>
                            <div className={sysStyles.text_field} style={{width:"50%", marginTop:"2rem"}}>
                                {!editable && <Button variant='contained' onClick={handleEditClick} sx={{width:"100%"}}>저장</Button>}
                            </div>
                        </div>
                        </>
                    ) : (
                        <div>
                            
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}