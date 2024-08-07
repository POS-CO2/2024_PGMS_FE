import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_um } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_um_list } from '../../assets/json/selectedPjt';
import { ButtonGroup } from '../../Button';

export default function Um() {

    const [userList, setUserList] = useState([]);

    const handleFormSubmit = (data) => {
        setUserList(data);
    }

    const [infoShow ,setInfoShow] = useState(false);


    const handleRowClick = () => {
        setInfoShow(true);
    };

    return (
        <>
            <div>
                {"시스템관리 > 사용자 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_um}/>
            <div>{"사용자 목록"}</div>
            <TableCustom title="사용자목록" data={table_um_list} button="" onRowClick={handleRowClick}/>
            <div>{"사용자 상세 정보"}</div>
            <ButtonGroup buttons={['Add', 'Delete', 'Edit']}/>
            {infoShow ? (
                <div>イムさん</div>
            ) : (
                <div>
                    
                </div>
            )}
        </>
    );
}