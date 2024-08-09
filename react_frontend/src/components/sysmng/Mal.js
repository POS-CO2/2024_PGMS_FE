import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_mal } from '../../assets/json/searchFormData';
import { table_mal_list, table_um_list } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';


export default function Mal() {

    const [log, setLog] = useState([]);

    const handleFormSubmit = (data) => {
        setLog(data);
    }

    const [showLog, setShowLog] = useState(showLog ? true : false);

    const handleRowClick = () => {
        setShowLog(!showLog);
    }

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 접속로그 조회"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_mal} />
            <div className={sysStyles.main_grid}>
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh"}}>
                    <div className={sysStyles.mid_title}>
                        {"사용자 목록"}
                    </div>
                    <TableCustom title="" data={table_um_list} button="" onRowClick={handleRowClick}/>
                </Card>
                <Card className={sysStyles.card_box} sx={{width:"50%"}}>
                    <div className={sysStyles.mid_title}>{"메뉴 접속 로그"}</div>
                    {showLog ? (
                        <TableCustom title="" data={table_mal_list} button="" />
                    ) : (
                        <></>
                    )}
                </Card>
            </div>
        </>
    );
}