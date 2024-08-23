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


export default function Mal() {
    const [user, setUser] = useState([]);
    const [log, setLog] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [showUser, setShowUser] = useState(true);

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
        console.log(e);
        if (e) {
            const {data} = await axiosInstance.get(`/sys/log?loginId=${e.loginId}`);
            console.log(data[0].logMenuList);
            const res = data[0].logMenuList
            setLog(res);
        }
        else{
            setShowLog(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axiosInstance.get("/sys/user");
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [])

    useEffect(() => {
    }, [user])

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 접속로그 조회"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_mal} />
            <div className={sysStyles.main_grid}>
                {showUser ? (
                    <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh", borderRadius:"15px"}}>
                        <div className={sysStyles.mid_title}>
                            {"사용자 목록"}
                        </div>
                        <TableCustom title="" data={user} button="" onRowClick={handleRowClick}/>
                    </Card>
                ) : (
                    <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh", borderRadius:"15px"}}>
                        <div className={sysStyles.mid_title}>
                            {"사용자 목록"}
                        </div>
                    </Card>
                )}
                
                <Card className={sysStyles.card_box} sx={{width:"50%", borderRadius:"15px"}}>
                    <div className={sysStyles.mid_title}>{"메뉴 접속 로그"}</div>
                    {showLog ? (
                        <TableCustom title="" data={log} button="" />
                    ) : (
                        <></>
                    )}
                </Card>
            </div>
        </>
    );
}