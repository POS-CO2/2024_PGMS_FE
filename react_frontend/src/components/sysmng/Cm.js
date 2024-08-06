import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import * as tableStyles from '../../assets/css/table.css'
import { formField_cm } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_cm_group, table_cm_code } from '../../assets/json/selectedPjt';

export default function Cm() {
    const [codeGroup, setCodeGroup] = useState([]);

    const handleFormSubmit = (data) => {
        setCodeGroup(data);
    }

    const [showTable, setShowTable] = useState(showTable ? true : false);

    const handleRowClick = () => {
        setShowTable(!showTable);
    }

    return (
        <>
            <div>
                {"시스템관리 > 코드 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_cm}/>
            <div>
                {"코드그룹ID"}
            </div>
            {/** 모달 추가 필요 */}
            <TableCustom title="코드그룹ID" data={table_cm_group} button="AllButton" onRowClick={handleRowClick}/>
            <div>{"코드리스트"}</div>
            {showTable ? (
                <TableCustom title="코드그룹ID" data={table_cm_code} button="AllButton" />
            ) : (
                <></>
            )}
            
        </>
    );
}