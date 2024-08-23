import React, { useState, useEffect } from 'react';
import SearchForms from '../../SearchForms';
import { formField_mal, formField_um } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_um_list } from '../../assets/json/selectedPjt';
import { ButtonGroup, ButtonGroupMm } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, TextField, Button, Hidden } from '@mui/material';
import { Dropdown } from '@mui/base';
import axiosInstance from '../../utils/AxiosInstance';
import { Select } from 'antd';

export default function Um() {
    const [formFields, setFormFields] = useState(formField_mal);
    const [userList, setUserList] = useState([]);
    const [userShow, setUserShow] = useState(true);
    const [password, setPassword] = useState(null);
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
        const {data} = await axiosInstance.get(`/sys/user`, {
            params: {
                loginId : e.loginId,
                role: e.role,
                deptCode: e.deptCode,
                userName: e.userName,
            }
        });
        setUserList(data ?? {});
        setUserShow(true);
        setInfoShow(false);
    }

    const [infoShow ,setInfoShow] = useState(false);

    const [selectedUser, setSelectedUser] = useState({
        userName: '',
        loginId: '',
        password: '',
        deptCode: '',
        role: '',
    });

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

    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
        if (modalType === 'Delete') {
            // 사용자 삭제 후 목록 갱신
            setUserList(prevList => prevList.filter(user => user.id !== data.id));
            setInfoShow(false); // 상세 정보 화면 비활성화
        }
        else if (modalType === 'UmAdd') {
            // 새로 추가된 사용자 목록에 추가
            setUserList(prevList => [...prevList, data]);
        }
    };

    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    }; 

    const handleAddClick = () => {
        showModal('UmAdd');
    }

    const [editable, setEditable] = useState(true);
    
    const handleEditable = () => {
        setEditable(false); // 되게함
        
    }
    
    const handleEditClick = async () => {
        const selectedDept = dept.find(option => option.label === selectedUser.deptCode) || {};
        const formData = {
            id: selectedUser.id,
            userName: selectedUser.userName,
            loginId: selectedUser.loginId,
            password,
            deptCode: selectedDept.value || selectedUser.deptCode,
            role: selectedUser.role,
        };
        setEditable(true);
        try {
            const {data} = await axiosInstance.patch('/sys/user', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            setUserList(prevList => prevList.map(user => 
                user.id === data.id ? data : user
            ));
            setSelectedUser(data);
            setPassword(null);
            
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    }

    const handleDeleteClick = () => {
        showModal('Delete');
    }

    
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSelectedUser(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const [dept, setDept] = useState([]);

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
                setDept(options);
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
                            <TableCustom title='' buttons={['Delete', 'Edit']} onClicks={[handleDeleteClick, handleEditable]} table={false} 
                            selectedRows={[selectedUser]}
                            modals={
                                [
                                    
                                    {
                                        "modalType" : 'Delete',
                                        'isModalOpen': isModalOpen.Delete,
                                        'handleOk': handleOk('Delete'),
                                        'handleCancel': handleCancel('Delete'),
                                        'rowData': selectedUser, // 추가 사항 삭제할 객체 전달
                                        'rowDataName': "userName",
                                        'url': '/sys/user', // 삭제 전달할 api 주소
                                    },
                                ]
                            }/>
                            <div className={sysStyles.card_box}>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>
                                    {"로그인 아이디"}
                                </div>
                                {!editable ? (
                                    <TextField id='loginId' disabled={editable} variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.loginId} value={selectedUser.loginId} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='loginId' disabled={editable} variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.loginId} value={selectedUser.loginId} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                                
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>
                                    {"비밀번호"}
                                </div>
                                {!editable ? (
                                    <TextField id='password' disabled={editable} variant='outlined' onChange={(e) => setPassword(e.target.value)} value={password} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='password' disabled={editable} variant='outlined' onChange={handleInputChange} value={''} placeholder='비밀번호 입력 시 비밀번호가 변경됩니다.' sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                                
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"이름 "}</div>
                                {!editable ? (
                                    <TextField id='userName' disabled={editable} variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.userName} value={selectedUser.userName} sx={{width:"100%"}}/>
                                ) : (
                                    <TextField id='userName' disabled={editable} variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.userName} value={selectedUser.userName} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"부서 명"}</div>
                                {!editable ? (
                                    <Select value={selectedUser.deptCode} onChange={(value) => handleInputChange({ target: { id: 'deptCode', value} })} defaultValue={selectedUser.deptCode} style={{width:"100%", height:"3.5rem", fontSize:"4rem"}}>
                                    {dept.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                    </Select>
                                ) : (
                                    <TextField id='deptCode' disabled={editable} variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.deptCode} value={selectedUser.deptCode} sx={{width:"100%", backgroundColor:"rgb(223,223,223)"}}/>
                                )}
                                
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"권한"}</div>
                                {!editable ? (
                                    <Select value={selectedUser.role} onChange={(value) => handleInputChange({ target: { id: 'role', value } })} defaultValue={selectedUser.role} style={{width:"100%", height:"3.5rem", fontSize:"4rem"}}>
                                    {access.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                    </Select>
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