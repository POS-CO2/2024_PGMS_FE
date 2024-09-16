import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import {
    revState, selectedRevState
    } from '../../../../atoms/pdsAtoms';
import axiosInstance from '../../../../utils/AxiosInstance';
import { Card } from '@mui/material';
import { pjtSalesColumns } from '../../../../assets/json/tableColumn';
import { TableCustomDoubleClickEdit } from "../../../../TableCustom";

export default function Rm({pjtId}) {
    const [revenues, setRevenues] = useRecoilState(revState);
    const [selectedRev, setSelectedRev] = useRecoilState(selectedRevState);
    const [year, setYear] = useState(new Date().getFullYear());

    // 매출액 row 클릭 시 호출될 함수
    const handleRevClick = (rev) => {
        setSelectedRev(rev ?? {});
    };

    // 저장 버튼 클릭시 호출될 함수
    const handleFormSubmit = async () => {
        handleYearChange(year);
    };

    const handleYearChange = async (year) => {
        setYear(year);
        const response = await axiosInstance.get(`/pjt/sales?pjtId=${pjtId}&year=${year}`);
        setRevenues(response.data);
    }

    return (
        <>
            <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                <TableCustomDoubleClickEdit 
                    title='매출액목록' 
                    data={revenues}
                    columns={pjtSalesColumns}                
                    buttons={['DoubleClickEdit']}
                    pagination={false}
                    onClicks={[() => {}]}
                    onRowClick={handleRevClick}
                    selectedRows={[selectedRev]}
                    pageType="rm"
                    handleFormSubmit={handleFormSubmit}
                    handleYearChange={handleYearChange}
                    year={year}
                />
            </Card>
            <Card sx={{ width: "50%", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                
            </Card>
        </>
    );
}