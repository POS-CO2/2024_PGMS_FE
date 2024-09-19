import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ea } from "../../assets/json/searchFormData";
import TableCustom from "../../TableCustom.js";
import { equipAnalLibColumns, equipAnalTypeColumns, equipAnalSourceColumns } from '../../assets/json/tableColumn';
import { Card } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as psqStyles from "../../assets/css/psq.css"
import * as XLSX from 'xlsx';

import { libData, typeData, sourceData } from '../../assets/json/saDataEx';

export default function Ea() {
    const [formData, setFormData] = useState(); // 검색 데이터
    const [analEquipData, setAnalEquipData] = useState([]); // 표
    const [analEquipChartData, setAnalEquipChartData] = useState([]); // 차트
    const [tableColumn, setTableColumn] = useState([]);

    const colors = ['#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc'];

    useEffect(() => {
        // 총 value 계산
        const totalValue = analEquipData.reduce((total, item) => total + item.totalEmissionQty, 0);

         // 각 항목의 비율 계산 후 arcLabel 할당
        const chartData = analEquipData.map((item, index) => {
            const percentage = totalValue ? ((item.totalEmissionQty / totalValue) * 100).toFixed(2) : 0; // 퍼센트 계산
            return {
                label: Object.values(item)[0],
                value: item.totalEmissionQty,
                color: colors[index % colors.length], // 색상을 순환하여 할당
                arcLabel: `${percentage}%`, // 비율을 %로 표시
            };
        });

        setAnalEquipChartData(chartData);
    }, [analEquipData]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        switch (data.selected) {
            case "설비LIB":
                //let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
                setAnalEquipData(libData);
                setTableColumn(equipAnalLibColumns);
                break;
    
            case "설비유형":
                //let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
                setAnalEquipData(typeData);
                setTableColumn(equipAnalTypeColumns);
                break;
    
            case "에너지원":
                //let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
                setAnalEquipData(sourceData);
                setTableColumn(equipAnalSourceColumns);
                break;
    
            default:
                console.log("알 수 없는 선택입니다.");
                break;
        }

        /*const response = await axiosInstance.get(url);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setAnalEquipData([
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 1' },
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 2' }
            ]);

        } else {
            //차트
            const scope1Data = response.data.map(perf => perf.scope1 || null);
            const scope2Data = response.data.map(perf => perf.scope2 || null);
            const formattedChartPerfs = [
                { data: scope1Data, stack: 'A', label: 'Scope 1' },
                { data: scope2Data, stack: 'A', label: 'Scope 2' }
            ];
            setAnalEquipData(formattedChartPerfs);
        }*/
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

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"분석및예측 > 설비별 분석"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ea} />

            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
             ) : (
                <>
                    <div className={sysStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "50%", height: "auto", borderRadius: "15px" }}>
                            <div className={psqStyles.title_container}>
                                <div className={chartStyles.chart_title}>{"설비별 실적 차트"}</div>
                            </div>

                            <PieChart
                                series={[
                                    {
                                        data: analEquipChartData,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        cornerRadius: 3,
                                        outerRadius: 150,
                                        //valueFormatter,
                                        arcLabel: (item) => `${item.arcLabel}%`,
                                        arcLabelMinAngle: 35,
                                    },
                                ]}
                                height={400}
                            />
                        </Card>

                        <Card className={saStyles.card_box} sx={{ width: "50%", height: "auto", borderRadius: "15px" }}>
                            <TableCustom columns={tableColumn} title="목록" data={analEquipData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(salesTableData)]} />
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}