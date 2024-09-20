import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_sa } from "../../assets/json/searchFormData";
import TableCustom from "../../TableCustom.js";
import { salesAnalColumns } from '../../assets/json/tableColumn';
import { Card } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as XLSX from 'xlsx';

export default function Sa() {
    const [formData, setFormData] = useState(); // 검색 데이터
    const [salesTableData, setSalesTableData] = useState([]); // 목록 표
    const [avgUnitPerDiv, setAvgUnitPerDiv] = useState([]); // 본부별 평균 원단위
    const [unitPerProd, setUnitPerProd] = useState([]); // 상품별 원단위

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);
        
        const startDate = `${data.calendar[0].$y}-${(data.calendar[0].$M + 1).toString().padStart(2, '0')}`;
        const endDate = `${data.calendar[1].$y}-${(data.calendar[1].$M + 1).toString().padStart(2, '0')}`;

        let url = `/anal/sales/table?startDate=${startDate}&endDate=${endDate}`;
        const tableResponse = await axiosInstance.get(url);
        setSalesTableData(tableResponse.data);

        url = `/anal/sales/div?startDate=${startDate}&endDate=${endDate}`;
        const perDivChartResponse = await axiosInstance.get(url);
        setAvgUnitPerDiv(perDivChartResponse.data);

        url = `/anal/sales/prod?startDate=${startDate}&endDate=${endDate}`;
        const perProdChartResponse = await axiosInstance.get(url);
        setUnitPerProd(perProdChartResponse.data);
    };
    
    const onDownloadExcelClick = (csvData) => {
        //const fileName = `사용금액 엑셀 양식_${formData.searchProject.pjtName}_${formData.actvYear}`;
        const fileName = `매출액 목록`;
    
        // 워크북 및 워크시트 생성
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // 헤더 생성 (salesAnalColumns 순서대로)
        const headers = salesAnalColumns.map(column => column.label);
        wsData.push(headers);
            
        // 데이터 생성
        for (const row of csvData) {
            const values = salesAnalColumns.map(column => row[column.key]);
            wsData.push(values);
        }
            
        // 워크시트에 데이터 추가
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // 파일 다운로드
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    function AvgUnitPerDivChart() {
        return (
            <>
                <div className={chartStyles.chart_title}>{"본부별 평균 배출량/매출액"}</div>

                <BarChart
                    dataset={avgUnitPerDiv}
                    xAxis={[{ 
                        scaleType: 'band',
                        data: avgUnitPerDiv.map(item => item.divCode),
                        colorMap: {
                            type: 'ordinal',
                            colors: ['#f5f2c8', '#9ee0bc', '#8483e0', '#b5a1f3', '#f7b0ec', '#ffd7fe'],
                        }
                    }]}
                    yAxis={[{
                        position: 'left',
                        tickLabelStyle: {
                            whiteSpace: 'nowrap',  // 라벨이 잘리지 않도록 설정
                            overflow: 'visible',  // 오버플로우 방지
                            textOverflow: 'ellipsis',
                        },
                    }]}
                    series={[{ dataKey: 'avgEmissionQtyPerSales' }]} //valueFormatter
                    //width={400}
                    height={300}
                    borderRadius={10}
                    margin={{ left: 80 }} // 왼쪽 여백 추가
                    sx={{
                        //change left yAxis label styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.4",
                            fontWeight: "bold",
                        },
                        // change bottom label styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.5",
                            fontWeight: "bold",
                        },
                        // bottomAxis Line Styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line ": {
                            strokeWidth: 0.4,
                        },
                        // leftAxis Line Styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                            strokeWidth: 0.4
                        },
                    }}
                    slotProps={{
                        legend: {
                            labelStyle: {
                                fill: 'black',
                            },
                        },
                    }}
                />
            </>
        )
    }

    function UnitPerProdChart() {
        return (
            <>
                <div className={chartStyles.chart_title}>{"상품별 평균 배출량/매출액"}</div>

                <BarChart
                    dataset={unitPerProd}
                    xAxis={[{ 
                        scaleType: 'band',
                        data: unitPerProd.map(item => item.divCode),
                        colorMap: {
                            type: 'ordinal',
                            colors: ['#b8a3d6', '#97d3e7', '#b97b8c', '#e89596', '#c7e294', '#6fa7c7', '#9ed1b7', '#f1cb86', '#ef9080'],
                        }
                    }]}
                    yAxis={[{
                        position: 'left',
                        tickLabelStyle: {
                            whiteSpace: 'nowrap',  // 라벨이 잘리지 않도록 설정
                            overflow: 'visible',  // 오버플로우 방지
                            textOverflow: 'ellipsis',
                        },
                    }]}
                    series={[{ dataKey: 'avgEmissionQtyPerSales' }]} //valueFormatter
                    height={300}
                    borderRadius={10}
                    margin={{ left: 80 }} // 왼쪽 여백 추가
                    sx={{
                        //change left yAxis label styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.4",
                            fontWeight: "bold",
                        },
                        // change bottom label styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.5",
                            fontWeight: "bold",
                        },
                        // bottomAxis Line Styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line ": {
                            strokeWidth: 0.4,
                        },
                        // leftAxis Line Styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                            strokeWidth: 0.4
                        },
                    }}
                    slotProps={{
                        legend: {
                            labelStyle: {
                                fill: 'black',
                            },
                        },
                    }}
                />
            </>
        )
    }

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"분석및예측 > 매출액별 분석"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_sa} />

            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
             ) : (
                <>
                    <div className={saStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "30%", height: "auto", borderRadius: "15px" }}>
                            <AvgUnitPerDivChart />
                        </Card>
                        <Card className={saStyles.card_box} sx={{ width: "70%", height: "auto", borderRadius: "15px" }}>
                            <UnitPerProdChart />
                        </Card>
                    </div>
                    
                    <div className={saStyles.main_grid}>
                        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                            <TableCustom columns={salesAnalColumns} title="목록" data={salesTableData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(salesTableData)]} />
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}