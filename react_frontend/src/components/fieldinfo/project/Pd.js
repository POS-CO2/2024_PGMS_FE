import React from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import project from "../../../assets/json/selectedPjt";
import managers from "../../../assets/json/manager";

export default function Pd() {
    return (
        <div>
            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>

            <div className={tableStyles.tableTitle}>조회결과</div>
            <Table data={project}/>

            <div className={tableStyles.tableTitle}>담당자목록</div>
            <Table data={managers}/>
        </div>
    );
}