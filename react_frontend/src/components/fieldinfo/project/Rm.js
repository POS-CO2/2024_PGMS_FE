import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Card } from '@mui/material';
import * as tableStyles from "../../../assets/css/newTable.css"
import * as mainStyles from "../../../assets/css/main.css"
import Table from "../../../Table";
import {TableCustomDoubleClickEdit} from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {formField_rm} from "../../../assets/json/searchFormData";
import { pjtColumns, pjtSalesColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';

export default function Rm() {
    const [formData, setFormData] = useState([]);         // 검색 데이터(프로젝트 조회 결과)
    const [salesAmts, setSalesAmts] = useState([]);       // 조회 결과(매출액 목록 리스트)
    const [selectedSA, setSelectedSA] = useState(null);   // 선택된 매출액(pk column only)

    // selectedSA 변경될 때마다 실행될 useEffect
    useEffect(() => {}, [selectedSA]);

    // saleAmt 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (salesAmts.length === 0) {
            const placeholderSA = {
                id: '',
                year: '',
                mth: '',
                salesAmt: '',
            };
            setSalesAmts([placeholderSA]);
        }
    }, [salesAmts]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData([data.searchProject]);
        const response = await axiosInstance.get(`/pjt/sales?pjtId=${data.searchProject.id}&year=${data.searchYear}`);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderSA = {
                id: '',
                year: '',
                mth: '',
                salesAmt: ''
            };
            setSalesAmts([placeholderSA]);
        } else {
            setSalesAmts(response.data);
        }
    };

    // 매출액 row 클릭 시 호출될 함수
    const handleSAClick = (salesAmt) => {
        setSelectedSA(salesAmt?.id ?? null);
    };
    
    return (
        <div>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 &gt; 매출액 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_rm} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : (
                <Card sx={{ width: "100%", height: "100%", borderRadius: "15px"}}>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table 
                        data={formData}
                        columns={pjtColumns}
                        key={JSON.stringify(formData)} // formData 변경 시 key 변경되어 리렌더링
                    />                    
                    <TableCustomDoubleClickEdit 
                        title='매출액목록' 
                        data={salesAmts}
                        columns={pjtSalesColumns}                
                        buttons={['Edit']}
                        pagination={false}
                        onClicks={[() => {}]}
                        onRowClick={handleSAClick}
                        selectedRows={[selectedSA]}
                    />
                </Card>
            )}
        </div>
    );
}