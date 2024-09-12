import React, { useEffect, useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_mal } from '../../assets/json/searchFormData';
import { table_mal_list, table_um_list } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';
import axios from 'axios';
import axiosInstance from '../../utils/AxiosInstance';
import { menuLogColumns, userColumns } from '../../assets/json/tableColumn';



export default function Mal() {
    const [user, setUser] = useState([]);
    const [transUser, setTransUser] = useState([]);
    const [log, setLog] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [showUser, setShowUser] = useState(true);
    const [formFields, setFormFields] = useState(formField_mal);

    const handleFormSubmit = async (e) => {
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

    const handleRowClick = async (e) => {
        setShowLog(true);
        setSelectedUser(e);
        if (e) {
            const {data} = await axiosInstance.get(`/sys/log?loginId=${e.loginId}`);
            const res = data[0].logMenuList
            setLog(res);
        }
        else{
            setShowLog(false);
        }
    }
    const [dept, setDept] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const {data} = await axiosInstance.get("/sys/user");
                setUser(data);
            } catch (error) {
                console.error(error);
            }
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
    }, [])

    useEffect(() => {
    }, [user])
    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 접속로그 조회"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />
            <div className={sysStyles.main_grid}>
                {showUser ? (
                    <Card className={sysStyles.card_box} sx={{width:"50%", height:"75vh", borderRadius:"15px"}}>
                        <TableCustom title="사용자 목록" data={user} button="" onRowClick={handleRowClick} columns={userColumns}/>
                    </Card>
                ) : (
                    <Card className={sysStyles.card_box} sx={{width:"50%", height:"75vh", borderRadius:"15px"}}>
                        <TableCustom title="사용자 목록" data={user} button="" onRowClick={handleRowClick} columns={userColumns}/>
                    </Card>
                )}
                
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"75vh", borderRadius:"15px"}}>
                    {showLog ? (
                        <TableCustom title="메뉴 접속 로그" data={log} button="" columns={menuLogColumns}/>
                    ) : (
                        <TableCustom title='메뉴 접속 로그' table={false} />
                    )}
                </Card>
            </div>
        </>
    );
}