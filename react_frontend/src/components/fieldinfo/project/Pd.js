import React from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import { AddAndDeleteButton } from "../../../Button";
import project from "../../../assets/json/selectedPjt";
import managers from "../../../assets/json/manager";
import { SearchFormPd } from "../../../SearchForms"

export default function Pd() {
    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>
            
            <SearchFormPd />

            <div className={tableStyles.table_title}>조회결과</div>
            <Table data={project}/>

            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>담당자목록</div>
                <div style={{marginRight: '23px'}}>
                    <AddAndDeleteButton />
                </div>
            </div>
            <Table data={managers} />
        </>
    );
}