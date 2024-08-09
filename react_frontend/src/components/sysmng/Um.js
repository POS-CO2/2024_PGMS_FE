import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_um } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_um_list } from '../../assets/json/selectedPjt';
import { ButtonGroup, ButtonGroupMm } from '../../Button';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';

export default function Um() {

    const [userList, setUserList] = useState([]);

    const handleFormSubmit = (data) => {
        setUserList(data);
    }

    const [infoShow ,setInfoShow] = useState(infoShow ? true : false);


    const handleRowClick = () => {
        setInfoShow(!infoShow);
    };

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 사용자 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_um}/>
            <div className={sysStyles.main_grid}>
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh"}}>
                    <div className={sysStyles.mid_title}>{"사용자 목록"}</div>
                    <TableCustom title="" data={table_um_list} button="" onRowClick={handleRowClick}/>
                </Card>
                <Card className={sysStyles.card_box} sx={{width:"50%"}}>
                    <div className={sysStyles.mid_title}>{"사용자 상세 정보"}</div>
                    
                    {infoShow ? (
                        <>
                            <ButtonGroupMm buttons={['Add', 'Delete', 'Edit']}/>
                            <div>イムさん수빈이꺼 폼 배껴올예정{/** 그 사용자 상세정보 어떻게 할건지 정해야함 모달도 필요 */}</div>
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