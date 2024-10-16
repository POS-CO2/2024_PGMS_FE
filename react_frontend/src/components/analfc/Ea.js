import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { eqLibAnaSearchForm, selectedPeriodState } from '../../atoms/searchFormAtoms';
import SearchForms from "../../SearchForms";
import { formField_ea } from "../../assets/json/searchFormData";
import TableCustom from "../../TableCustom.js";
import { equipAnalLibColumns, equipAnalTypeColumns, equipAnalSourceColumns } from '../../assets/json/tableColumn';
import { Box, Card, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { PieChart } from '@mui/x-charts/PieChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as psqStyles from "../../assets/css/psq.css"
import * as XLSX from 'xlsx';

export default function Ea() {
    const [formData, setFormData] = useRecoilState(eqLibAnaSearchForm); // 검색 데이터
    const [selectedCal, setSelectedCal] = useRecoilState(selectedPeriodState);
    const [analEquipData, setAnalEquipData] = useState([]); // 표
    const [analEquipChartData, setAnalEquipChartData] = useState([]); // 차트
    const [tableColumn, setTableColumn] = useState([]);

    const colors = ['#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc'];

    useEffect(() => {
        // selectedCal이 변경되면 formData의 calendar 값만 업데이트
       if (formData.calendar !== selectedCal) {
           setFormData((prevFormData) => ({
               ...prevFormData,
               calendar: selectedCal,  // calendar 값만 업데이트
           }));
       }
   }, [selectedCal]);

   useEffect(() => {
       if (Object.keys(formData).length === 2) {
           if(formData.calendar === selectedCal && selectedCal.length === 2) {
               handleFormSubmit(formData);
           } 
       }
   }, [formData])

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
        setSelectedCal(data.calendar);
        
        const startDate = `${data.calendar[0].$y}-${(data.calendar[0].$M + 1).toString().padStart(2, '0')}`;
        const endDate = `${data.calendar[1].$y}-${(data.calendar[1].$M + 1).toString().padStart(2, '0')}`;
        
        let url = `/anal/equip?startDate=${startDate}&endDate=${endDate}&selected=${data.selected}`;
        const response = await axiosInstance.get(url);
        setAnalEquipData(response.data);

        switch (data.selected) {
            case "설비LIB":
                setTableColumn(equipAnalLibColumns);
                break;
    
            case "설비유형":
                setTableColumn(equipAnalTypeColumns);
                break;
    
            case "에너지원":
                setTableColumn(equipAnalSourceColumns);
                break;
    
            default:
                console.log("알 수 없는 선택입니다.");
                break;
        }
    };

    const onDownloadExcelClick = (csvData) => {
        const fileName = `설비별 분석_${formData.selected}`;
    
        // 워크북 및 워크시트 생성
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // 'formatted'로 시작하지 않는 칼럼 필터링
        const filteredColumns = tableColumn.filter(column => !column.key.startsWith('formatted'));

        // 헤더 생성 (필터링된 tableColumn 순서대로)
        const headers = filteredColumns.map(column => column.label);
        wsData.push(headers);
            
        // 데이터 생성
        for (const row of csvData) {
            const values = filteredColumns.map(column => row[column.key]);
            wsData.push(values);
        }
            
        // 워크시트에 데이터 추가
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // 파일 다운로드
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    // 서치폼이 변경될 때 목록 clear
    const handleFieldsChange = () => {
        setFormData({});
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"분석및예측 > 설비별 분석"}
            </div>

            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formField_ea} 
                handleFieldsChange={handleFieldsChange}
            />

            {Object.keys(formData).length < 2 ? 
                <></> 
                : formData.calendar && formData.calendar.length === 0 ? 
                <></> 
                : (
                <>
                    <div className={sysStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "50%", height: "auto", borderRadius: "15px" }}>
                            <div className={psqStyles.title_container}>
                                <div className={chartStyles.chart_title}>{"설비별 실적 차트"}</div>
                            </div>

                            {analEquipChartData && analEquipChartData.length > 0 ? (
                                <PieChart
                                    series={[
                                        {
                                            data: analEquipChartData,
                                            highlightScope: { fade: 'global', highlight: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                            cornerRadius: 3,
                                            outerRadius: 150,
                                            valueFormatter: (item) => `${item.value} kgGHG`,
                                            arcLabel: (item) => `${item.arcLabel}`,
                                            arcLabelMinAngle: 35,
                                        },
                                    ]}
                                    height={400}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        textAlign: 'center',
                                        padding: '2rem',
                                    }}
                                >
                                    <InboxIcon sx={{ fontSize: 60, color: 'gray' }} />
                                    <br />
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        현재 요청하신 조회 결과가 없습니다.
                                    </Typography>
                                </Box>
                            )}
                        </Card>

                        <Card className={saStyles.card_box} sx={{ width: "50%", height: "auto", borderRadius: "15px" }}>
                            <TableCustom columns={tableColumn} title="목록" data={analEquipData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(analEquipData)]} />
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}