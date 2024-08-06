import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import { formField_mal } from '../../assets/json/searchFormData';
import { table_mal_list, table_um_list } from '../../assets/json/selectedPjt';
import TableCustom from '../../TableCustom';

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
            <div>
                {"시스템관리 > 접속로그 조회"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_mal} />
            <div>
                {"사용자 목록"}
            </div>
            <TableCustom title="사용자목록" data={table_um_list} button="" onRowClick={handleRowClick}/>
            <div>{"메뉴 접속 로그"}</div>
            {showLog ? (
                <TableCustom title="메뉴접속로그" data={table_mal_list} button="" />
            ) : (
                <></>
            )}
        </>
    );
}