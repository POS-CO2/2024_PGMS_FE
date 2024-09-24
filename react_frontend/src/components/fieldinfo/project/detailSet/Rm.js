import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import {
    revState, selectedRevState
    } from '../../../../atoms/pdsAtoms';
import axiosInstance from '../../../../utils/AxiosInstance';
import ChartCustom from "../../../../ChartCustom";
import { Card } from '@mui/material';
import { pjtSalesColumns } from '../../../../assets/json/tableColumn';
import { TableCustomDoubleClickEdit } from "../../../../TableCustom";
import { computeMikkTSpaceTangents } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default function Rm({pjtId}) {
    const [revenues, setRevenues] = useRecoilState(revState);
    const [selectedRev, setSelectedRev] = useRecoilState(selectedRevState);
    const [chartReves, setChartReves] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        handleYearChange(year);
        transformToRevChart(revenues);
    }, [])

    const transformToRevChart = (data) => {
        //data가 빈 배열인지 확인
        if (data.length === 0) {
            // 빈 데이터인 경우, 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setChartReves(
                { data: Array(12).fill(null), stack: 'A' },
            );

        } else {
            // 차트에 사용할 데이터를 숫자 배열로 변환
            const chartData = data.map(rev => {
                // 쉼표를 제거하고 숫자로 변환
                const numericValue = parseFloat(rev.salesAmt.replace(/,/g, '')) || null;
                return numericValue;
            });

            const formattedChartReves = [
                { data: chartData, stack: 'A' },
            ];
            setChartReves(formattedChartReves);
        }
    }

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
        transformToRevChart(response.data);
    }

    return (
        <>
            <Card sx={{ width: "30%", height: "auto", borderRadius: "0.5rem" }}>
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
            <Card sx={{ width: "70%", borderRadius: "0.5rem" }}>
                <ChartCustom title={"매출액차트"} data={chartReves} />
            </Card>
        </>
    );
}