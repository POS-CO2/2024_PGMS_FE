import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { revAnaSearchForm } from '../../atoms/searchFormAtoms';
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
    const [formData, setFormData] = useRecoilState(revAnaSearchForm); // 검색 데이터
    const [salesTableData, setSalesTableData] = useState([]); // 목록 표
    const [avgUnitPerDiv, setAvgUnitPerDiv] = useState([]); // 본부별 평균 원단위
    const [unitPerProd, setUnitPerProd] = useState([]); // 상품별 원단위
    const [selectedDiv, setSelectedDiv] = useState(null); // 선택된 본부
    const [selectedBar, setSelectedBar] = useState(null); // 선택된 바 상태 추가
    const [highlightedItem, setHighlightedItem] = useState(null); // 강조된 항목 상태 추가

    useEffect(() => {
        // formData값이 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        if(Object.keys(formData).length !== 0) {
            handleFormSubmit(formData);
        }
    }, []);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);
        setHighlightedItem(null); // 강조된 항목 초기화
        
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

    const handleAxisClick = async (event, data, AxisData) => {
        setSelectedDiv(data.axisValue); // 클릭된 축의 데이터를 상태에 저장
        setSelectedBar(data.dataIndex); // 클릭된 바의 인덱스를 상태에 저장
        setHighlightedItem({ seriesId: 'A', dataIndex: data.dataIndex }); // 클릭된 항목을 강조

        const startDate = `${formData.calendar[0].$y}-${(formData.calendar[0].$M + 1).toString().padStart(2, '0')}`;
        const endDate = `${formData.calendar[1].$y}-${(formData.calendar[1].$M + 1).toString().padStart(2, '0')}`;

        // 본부별 상품
        let url = `/anal/sales/prod-div?startDate=${startDate}&endDate=${endDate}&divCode=${data.axisValue}`;
        const newPerProdChartResponse = await axiosInstance.get(url);
        setUnitPerProd(newPerProdChartResponse.data);

        // 본부별 테이블
        url = `/anal/sales/table-div?startDate=${startDate}&endDate=${endDate}&divCode=${data.axisValue}`;
        const newTableResponse = await axiosInstance.get(url);
        setSalesTableData(newTableResponse.data);
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"분석및예측 > 매출액별 분석"}
            </div>

            <SearchForms initialValues={formData} onFormSubmit={handleFormSubmit} formFields={formField_sa} />

            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
             ) : (
                <>
                    <div className={saStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "30%", height: "auto", borderRadius: "15px" }}>
                            <div className={chartStyles.chart_title}>{"본부별 월별 평균 배출량/매출액"}</div>

                            <BarChart
                                dataset={avgUnitPerDiv}
                                xAxis={[{ 
                                    scaleType: 'band',
                                    data: avgUnitPerDiv.map(item => item.divCode),
                                    colorMap: {
                                        type: 'ordinal',
                                        colors: ['#f5f2c8', '#9ee0bc', '#8483e0', '#b5a1f3', '#f7b0ec', '#ffd7fe'],
                                        /*colors: avgUnitPerDiv.map((item, index) => 
                                            selectedBar === index ? '#ffcc00' : '#9ee0bc' // 클릭된 바는 강조 색상(#ffcc00)으로 설정
                                        ),*/
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
                                series={[{
                                    id: 'A', // seriesId 명시적으로 추가
                                    dataKey: 'avgEmissionQtyPerSales',
                                    highlightScope: {
                                        highlighted: 'none', // fade 만 설정 //highlighted: 'item'
                                        faded: 'global',  // 나머지는 흐리게 설정
                                    },
                                }]} //valueFormatter
                                onAxisClick={handleAxisClick}
                                highlightedItem={highlightedItem} // 강조된 항목 설정
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
                        </Card>
                        <Card className={saStyles.card_box} sx={{ width: "70%", height: "auto", borderRadius: "15px" }}>
                            <div className={chartStyles.chart_title}>{"상품별 월별 평균 배출량/매출액"}</div>

                            <BarChart
                                dataset={unitPerProd}
                                xAxis={[{ 
                                    scaleType: 'band',
                                    data: unitPerProd.map(item => item.prodTypeCode),
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