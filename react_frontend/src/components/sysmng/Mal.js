import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { accessLogSearchForm } from '../../atoms/searchFormAtoms';
import SearchForms from '../../SearchForms';
import { formField_mal } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';
import axiosInstance from '../../utils/AxiosInstance';
import { menuLogColumns, userColumns } from '../../assets/json/tableColumn';

export default function Mal() {
    const [formFields, setFormFields] = useState(formField_mal);
    const [formData, setFormData] = useRecoilState(accessLogSearchForm);
    const [user, setUser] = useState([]);
    const [transUser, setTransUser] = useState([]);
    const [log, setLog] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [showUser, setShowUser] = useState(true);
    const [dept, setDept] = useState([]);

    const fetchUserList = async () => {
        try {
            const {data} = await axiosInstance.get("/sys/user");
            setUser(data);
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
            console.log("updateFormFields", updateFormFields);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDeptCode();

        // formData값이 없으면 코드 그룹ID 목록을 findAll, 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        Object.keys(formData).length === 0 ? fetchUserList() : handleFormSubmit(formData);
    }, []);

    const handleFormSubmit = async (e) => {
        setFormData(e);
        setShowUser(false);
        const {data} = await axiosInstance.get(`/sys/user`,{
            params:{
                loginId : e.loginId,
                role: e.role,
                deptCode: e.deptCode,
                userName: e.userName,
            }
        })
        setUser(data);
        setShowUser(true);
        setShowLog(false);
    }

    const [showLog, setShowLog] = useState(false);

    const handleRowClick = async (data) => {
        const e = data.row
        setShowLog(true);
        setSelectedUser(e);
        if (e) {
            const {data} = await axiosInstance.get(`/sys/log?loginId=${e.loginId}`);
            if (data.length !== 0){
                const res = data[0].logMenuList;
                setLog(res);
            }
            else {
                setLog([]);
            }
            
        }
        else{
            setShowLog(false);
        }
    }

    // 서치폼이 변경될 때 목록 clear
    const handleFieldsChange = () => {
        setUser([]);
        setSelectedUser({});
    };

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 접속로그 조회"}
            </div>
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formFields} 
                handleFieldsChange={handleFieldsChange}
                handleEmptyFields={fetchUserList}
            />

            {(!user || user.length === 0) ? 
                <></> :
                <div className={sysStyles.main_grid}>
                    {showUser ? (
                        <Card className={sysStyles.card_box} sx={{width:"50%", height:"77vh", borderRadius:"15px"}}>
                            <TableCustom title="사용자 목록" data={user} button="" onRowClick={handleRowClick} columns={userColumns}/>
                        </Card>
                    ) : (
                        <Card className={sysStyles.card_box} sx={{width:"50%", height:"77vh", borderRadius:"15px"}}>
                            <TableCustom title="사용자 목록" data={user} button="" onRowClick={handleRowClick} columns={userColumns}/>
                        </Card>
                    )}
                    
                    <Card className={sysStyles.card_box} sx={{width:"50%", height:"77vh", borderRadius:"15px"}}>
                        {showLog ? (
                            <TableCustom title="메뉴 접속 로그" data={log} button="" columns={menuLogColumns}/>
                        ) : (
                            <TableCustom title='메뉴 접속 로그' table={false} />
                        )}
                    </Card>
                </div>
            }
        </>
    );
}