import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { userMgrSearchForm } from '../../atoms/searchFormAtoms';
import SearchForms from '../../SearchForms';
import { formField_mal, formField_um } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card, TextField,  } from '@mui/material';
import { Dropdown } from '@mui/base';
import axiosInstance from '../../utils/AxiosInstance';
import { ConfigProvider, Select } from 'antd';
import Swal from 'sweetalert2';
import { userColumns } from '../../assets/json/tableColumn';

export default function Um() {
    const [formFields, setFormFields] = useState(formField_mal);
    const [formData, setFormData] = useRecoilState(userMgrSearchForm);
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

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const {data} = await axiosInstance.get("/sys/user");
                setUserList(data);
            } catch (error) {
                console.log(error);
            }
        };

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
        
        // formData값이 없으면 코드 사용자 목록을 findAll, 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        Object.keys(formData).length === 0 ? fetchUserList() : handleFormSubmit(formData);
    },[]);

    const handleFormSubmit = async (e) => {
        setFormData(e);
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

    const [selectedUser, setSelectedUser] = useState([]);

    const handleRowClick = (data) => {
        const e = data.row;
    
        setSelectedUser(e ?? {});
        if (e === undefined) {
            setInfoShow(false);
        }
        else {
            
            setInfoShow(true);
        }
        setEditable(true);
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
    
    const handleEditClick = async () => {
        const selectedDept = dept.find(option => option.label === selectedUser.deptCode) || {};
        let swalOptions = {
            confirmButtonText: '확인'
        };
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
            setSelectedUser(data ?? {});
            setPassword(null);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.userName}이 성공적으로 수정되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message,
            swalOptions.icon = 'error';

        }
        Swal.fire(swalOptions);
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
    
    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 사용자 관리"}
            </div>
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formFields}
            />
            <div className={sysStyles.main_grid}>
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"80vh", borderRadius:"15px"}}>
                    {userShow && <TableCustom title="사용자목록" columns={userColumns} data={userList} buttons={['Delete', 'Add']} selectedRows={[selectedUser]} onClicks={[handleDeleteClick, handleAddClick]} onRowClick={(e) => handleRowClick(e)} modals={
                        [
                            isModalOpen.UmAdd && {
                                "modalType" : 'UmAdd',
                                'isModalOpen': isModalOpen.UmAdd,
                                'handleOk': handleOk('UmAdd'),
                                'handleCancel': handleCancel('UmAdd')
                            },
                            isModalOpen.Delete && {
                                "modalType" : 'Delete',
                                'isModalOpen': isModalOpen.Delete,
                                'handleOk': handleOk('Delete'),
                                'handleCancel': handleCancel('Delete'),
                                'rowData': selectedUser, // 추가 사항 삭제할 객체 전달
                                'rowDataName': "userName",
                                'url': '/sys/user', // 삭제 전달할 api 주소
                            },
                        ].filter(Boolean)
                    }/>}
                </Card>
                <Card className={sysStyles.card_box} sx={{width:"50%", borderRadius:"15px", height:"80vh"}}>
                    {infoShow ? (
                        <ConfigProvider
                        theme={{token:{fontFamily:"SUITE-Regular"}}}>
                            <TableCustom title='사용자 상세정보' buttons={['DoubleClickEdit']} onClicks={[handleEditClick]} table={false} 
                            selectedRows={[selectedUser]}/>
                            <div className={sysStyles.card_box}>
                            <div className={sysStyles.text_field} style={{marginTop:"2rem",width:"50%"}}>
                                <div className={sysStyles.text}>
                                    {"로그인 아이디"}
                                </div>
                                <TextField size="small" id='loginId'  variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.loginId} value={selectedUser.loginId} sx={{width:"100%"}}/>
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"0.5rem",width:"50%"}}>
                                <div className={sysStyles.text}>
                                    {"비밀번호"}
                                </div>
                                <TextField size="small" id='password'  variant='outlined' onChange={(e) => setPassword(e.target.value)} value={password} sx={{width:"100%"}}/>
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"0.5rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"이름 "}</div>
                                    <TextField size="small" id='userName'  variant='outlined' onChange={handleInputChange} defaultValue={selectedUser.userName} value={selectedUser.userName} sx={{width:"100%"}}/>
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"0.5rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"부서 명"}</div>
                                    <Select value={selectedUser.deptCode} onChange={(value) => handleInputChange({ target: { id: 'deptCode', value} })} defaultValue={selectedUser.deptCode} style={{width:"100%", height:"2.5rem", fontSize:"4rem"}}>
                                    {dept.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                    </Select>
                            </div>
                            <div className={sysStyles.text_field} style={{marginTop:"0.5rem",width:"50%"}}>
                                <div className={sysStyles.text}>{"권한"}</div>
                                    <Select value={selectedUser.role} onChange={(value) => handleInputChange({ target: { id: 'role', value } })} defaultValue={selectedUser.role} style={{width:"100%", height:"2.5rem", fontSize:"4rem"}}>
                                    {access.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                    </Select>
                            </div>
                        </div>
                        </ConfigProvider>
                    ) : (
                        <TableCustom title='사용자 상세정보' table={false} />
                    )}
                </Card>
            </div>
        </>
    );
}