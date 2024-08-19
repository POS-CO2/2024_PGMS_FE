import React, { useState, useEffect } from 'react';
import SearchForms from '../../SearchForms';
import { formField_mal, formField_um } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_um_list } from '../../assets/json/selectedPjt';
import { ButtonGroup, ButtonGroupMm } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, TextField, Button } from '@mui/material';
import { Dropdown } from '@mui/base';
import axiosInstance from '../../utils/AxiosInstance';

export default function Um() {
    const [formFields, setFormFields] = useState(formField_mal);
    const [userList, setUserList] = useState([]);
    const [userShow, setUserShow] = useState(true);
    const access = [
        {
            value: 'FP',
            label: "현장 담당자"
        },
        {
            value: 'HP',
            label: "본사 담당자"
        },
        {
            value: 'ADMIN',
            label: "시스템 관리자"
        },
    ]

    const handleFormSubmit = async (e) => {
        setUserShow(false);
        console.log(e);
        const {data} = await axiosInstance.get(`/sys/user`, {
            params: {
                loginId : e.loginId,
                role: e.role,
                deptCode: e.deptCode,
                userName: e.userName,
            }
        });
        setUserList(data ?? {});
        console.log(data);
        setUserShow(true);
        setInfoShow(false);
    }

    const [infoShow ,setInfoShow] = useState(false);

    const [selectedUser, setSelectedUser] = useState([]);

    const handleRowClick = (e) => {
        setSelectedUser(e ?? {});
        if (e === undefined) {
            setInfoShow(false);
        }
        else {
            setInfoShow(true);
        }
        
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

    const handleInputChange = (e) => {
        console.log(e);
        setSelectedUser({
            ...selectedUser,
            [e.target.id]: e.target.value
        });
    };

    useEffect(() => {
        (async () => {
            const {data} = await axiosInstance.get("/sys/user");
            setUserList(data);
        })();

        const fetchDeptCode = async () => {
            try {
                const res = await axiosInstance.get("/sys/unit?unitType=부서코드");
                const options = res.data.map(dept => ({
                    value: dept.code,
                    label: dept.name,
                }));

                const updateFormFields = formField_mal.map(field => 
                field.name === 'deptCode' ? {...field, options } : field);

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDeptCode();
    },[]);

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 사용자 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields}/>
            <div className={sysStyles.main_grid}>
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh", borderRadius:"15px"}}>
                    <div className={sysStyles.mid_title}>{"사용자 목록"}</div>
                    {userShow && <TableCustom title="" data={userList} buttons={['Add']} onClicks={[handleAddClick]} onRowClick={(e) => handleRowClick(e)} modals={
                        [
                            {
                                "modalType" : 'UmAdd',
                                'isModalOpen': isModalOpen.UmAdd,
                                'handleOk': handleOk('UmAdd'),
                                'handleCancel': handleCancel('UmAdd')
                            },
                        ]
                    }/>}
                </Card>
                <Card className={sysStyles.card_box} sx={{width:"50%", borderRadius:"15px"}}>
                    <div className={sysStyles.mid_title}>{"사용자 상세 정보"}</div>
                    
                    {infoShow ? (
                        <>
                            <TableCustom title='' buttons={['Delete', 'Edit']} onClicks={[handleDeleteClick, handleEditClick]} table={false} 
                            selectedRows={[selectedUser]}
                            modals={
                                [
                                    
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
                                    <TextField id='branchName' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.deptCode} value={selectedUser.deptCode} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='branchName' disabled={editable} variant='outlined' onChange={(e) => setSelectedUser(e.target.value)} defaultValue={selectedUser.deptCode} value={selectedUser.deptCode} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                                
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"권한"}</div>
                                {!editable ? (
                                    <TextField
                                        id="role"
                                        select
                                        disabled={editable}
                                        defaultValue={selectedUser.role}
                                        onChange={handleInputChange}
                                        value={selectedUser.role || ''}
                                        SelectProps={{
                                            native: true,
                                        }}
                                        sx={{width:"100%"}}
                                        >
                                        {access.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        id="role"
                                        select
                                        disabled={editable}
                                        defaultValue={selectedUser.role}
                                        value={selectedUser.role || ''}
                                        onChange={handleInputChange}
                                        SelectProps={{
                                            native: true,
                                        }}
                                        sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}
                                        >
                                        {access.map((option) => (
                                            <option key={option.value} value={option.value}>
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