import React, { useState, useEffect } from 'react';
import SearchForms from "../../../SearchForms.js";
import { formField_psq_fp } from "../../../assets/json/searchFormData.js"
import { CustomButton } from '../Ps_1_2';
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import * as mainStyle from '../../../assets/css/main.css';
import * as ps12Style from '../../../assets/css/ps12.css';
import * as sysStyles from '../../../assets/css/sysmng.css';
import * as esmStyles from '../../../assets/css/esm.css';
import * as chartStyles from "../../../assets/css/chart.css"
import * as saStyles from "../../../assets/css/sa.css"
import * as psqStyles from "../../../assets/css/psq.css"
import { Card } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import axiosInstance from '../../../utils/AxiosInstance.js';
import { emissionPerfPjtColumns, perfPjtColumns, pjtColumns } from '../../../assets/json/tableColumn';

export default function Psq_Fp() {
    const [formFields, setFormFields] = useState(formField_psq_fp);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [selectedPjtOption, setSelectedPjtOption] = useState([]); // searchForm에서 선택되어있는 프로젝트
    const [selectedPjt, setSelectedPjt] = useState([]); // 조회결과로 출력되는 프로젝트
    const [emissionTableData, setEmissionTableData] = useState([]); // 설비별 표
    const [perfsData, setPerfsData] = useState(Array(12).fill({})); // scope1, scope2, total 표
    const [chartPerfs, setChartPerfs] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리
    const [pieChartPerfs, setPieChartPerfs] = useState([]);

    const [content, setContent] = useState('chart'); // chart || table
    const handleButtonClick = (value) => {
        setContent(value);
    };

    const [selectedMonth, setSelectedMonth] = useState({ key: '0', label: '- All -', });
    const items = [{ key: '0', label: '- All -', }, { key: '1', label: '1월', }, { key: '2', label: '2월', }, { key: '3', label: '3월', }, { key: '4', label: '4월', }, { key: '5', label: '5월', }, { key: '6', label: '6월', },
        { key: '7', label: '7월', }, { key: '8', label: '8월', }, { key: '9', label: '9월', }, { key: '10', label: '10월', }, { key: '11', label: '11월', }, { key: '12', label: '12월', },];
    const colors = ['#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc'];

    // 프로젝트 드롭다운 옵션 설정
    const [pjtOptions, setPjtOptions] = useState([]);
    const [projectData, setProjectData] = useState([]);  // 전체 프로젝트 데이터를 저장
    useEffect(() => {
        const fetchPjtOptions = async () => {
            try {
                const res = await axiosInstance.get("/pjt/my");
                setProjectData(res.data);  // 전체 프로젝트 데이터를 저장
                const options = res.data.map(pjt => ({
                    value: pjt.pjtId,  // value에 id만 전달
                    label: pjt.pjtCode +"/"+ pjt.pjtName,
                }));
                setPjtOptions(options);
                const updateFormFields = formFields.map(field =>
                    field.name === 'searchProject' ? { ...field, options } : field
                );

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPjtOptions();
    }, []);

    // 프로젝트 선택 후 대상년도 드롭다운 옵션 설정
    const onProjectSelect = (selectedData, form) => {
        const selectedProject = projectData.find(pjt => pjt.pjtId === selectedData);
        setSelectedPjtOption(selectedProject);

        if (selectedProject) {
            const yearOptions = [];
            const currentYear = new Date().getFullYear();
            const ctrtFrYear = selectedProject.ctrtFrYear;
            const ctrtToYear = Math.min(selectedProject.ctrtToYear, currentYear);

            // 계약년도부터 현재년도까지의 옵션 생성
            for (let year = ctrtToYear; year >= ctrtFrYear; year--) {
                yearOptions.push({ value: year.toString(), label: year.toString() });
            }

            // actvYear 필드를 업데이트하여 새로운 옵션 반영
            const updatedFields = formFields.map(field =>
                field.name === 'actvYear' ? { ...field, options: yearOptions } : field
            );

            setFormFields(updatedFields);

            // 옵션 데이터가 있으면 드롭다운을 활성화, default값 설정
            if (yearOptions.length > 0) {
                setActvYearDisabled(false);
                form.setFieldsValue({ actvYear: yearOptions[0].value });
            }
        }
    };

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        // 데이터가 바뀌지 않았으면 종료
        if (JSON.stringify(formData) === JSON.stringify(data)) {
            return;
        }

        setFormData(data);
        setSelectedPjt(selectedPjtOption);

        // scope1,2
        let url = `/perf/pjt?pjtId=${data.searchProject}&year=${data.actvYear}`;
        const response = await axiosInstance.get(url);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setChartPerfs([
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 1' },
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 2' }
            ]);
            setPerfsData([]);

        } else {
            //차트
            const scope1Data = response.data.map(perf => perf.scope1 || null);
            const scope2Data = response.data.map(perf => perf.scope2 || null);
            const formattedChartPerfs = [
                { data: scope1Data, stack: 'A', label: 'Scope 1' },
                { data: scope2Data, stack: 'A', label: 'Scope 2' }
            ];
            setChartPerfs(formattedChartPerfs);

            // 표
            const scope1TableData = { scope: 'scope1 (kgGHG)' };
            const scope2TableData = { scope: 'scope2 (kgGHG)' };
            const totalTableData = { scope: 'total (kgGHG)' };

            let scope1Sum = 0;
            let scope2Sum = 0;
            let totalSum = 0;

            // 각 월 데이터를 채워 넣고 합산 계산
            response.data.forEach((item, index) => {
                scope1TableData[index+1] = item.scope1;
                scope2TableData[index+1] = item.scope2;
                totalTableData[index+1] = item.total;

                scope1Sum += item.scope1;
                scope2Sum += item.scope2;
                totalSum += item.total;
            });

            // 합산 값 추가
            scope1TableData['total'] = scope1Sum;
            scope2TableData['total'] = scope2Sum;
            totalTableData['total'] = totalSum;

            // 최종 데이터 배열에 추가
            const formattedTableData = [scope1TableData, scope2TableData, totalTableData];

            // 상태값 업데이트
            setPerfsData(formattedTableData);
        }

        // 설비별
        // 파이 차트 데이터 설정하기, default는 all(0)
        setSelectedMonth({ key: '0', label: '- All -', });
        let pieChartUrl = `/perf/pjt-equip?pjtId=${data.searchProject}&year=${data.actvYear}&mth=${0}`;
        let pieChartPerfsData = await axiosInstance.get(pieChartUrl);
        const colorPerItem = pieChartPerfsData.data.map((item, index) => ({
            label: item.equipName,
            value: item.totalQty,
            color: colors[index % colors.length], // 색상을 순환하여 할당
        }));
        setPieChartPerfs(colorPerItem);

        const emissionPerfsData = pieChartPerfsData.data.map(perf => {
            // 기본 구조 설정
            const perfData = {
                equipName: perf.equipName,
                formattedTotalQty: perf.formattedTotalQty,
            };
    
            // emissionQuantityList 순회하며 월별 데이터를 추가
            perf.emissionQuantityList.forEach(item => {
                if (item && item.actvMth) {
                    perfData[item.actvMth] = item['formattedCo2EmtnConvTotalQty'];
                }
            });
            // 모든 월(1월부터 12월까지)의 데이터가 없을 경우 기본값으로 채워줌
            for (let month = 1; month <= 12; month++) {
                const monthKey = `${month}`;
                if (!perfData.hasOwnProperty(monthKey)) {
                    perfData[monthKey] = '';
                }
            }
            
            return perfData;
        })

        setEmissionTableData(emissionPerfsData);
    };

    const valueFormatter = (item) => `${item.value}`;

    // Dropdown에서 항목 선택 시 호출되는 함수
    const handleMenuClick = async ({ key }) => {
        const selectedItem = items.find(item => item.key === key);
        setSelectedMonth(selectedItem);

        let pieChartUrl = `/perf/pjt-equip?pjtId=${formData.searchProject}&year=${formData.actvYear}&mth=${selectedItem.key}`;
        let pieChartPerfsData = await axiosInstance.get(pieChartUrl);
        const colorPerItem = pieChartPerfsData.data.map((item, index) => ({
            label: item.equipName,
            value : Number(selectedItem.key) === 0 
                ? item.totalQty 
                : (item.emissionQuantityList && item.emissionQuantityList[0] && item.emissionQuantityList[0].co2EmtnConvTotalQty) 
                    ? item.emissionQuantityList[0].co2EmtnConvTotalQty 
                    : null,
            color: colors[index % colors.length], // 색상을 순환하여 할당
        }));
        setPieChartPerfs(colorPerItem);
    };

    const onDownloadExcelClick = (title, csvData, columns) => {
        const fileName = `${title}_${formData.searchProject.pjtName}_${formData.actvYear}`;

        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성 (columns 순서대로)
        const headers = columns.map(column => column.label);
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = columns.map(column => {
                const escaped = ('' + row[column.key]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        // CSV 파일 생성
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"배출실적 > 실적조회 > 프로젝트별 조회"}
            </div>
            <SearchForms
                onFormSubmit={handleFormSubmit}
                formFields={formFields.map(field => field.name === 'actvYear' ? { ...field, disabled: actvYearDisabled } : field)} // actvYear 필드의 disabled 상태 반영
                onProjectSelect={onProjectSelect} />
           
            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
             ) : (
                <>
                    <div className={esmStyles.main_grid}>
                        <Card sx={{ width: "100%", height: "auto", borderRadius: "15px", marginBottom: "1rem" }}>
                            <TableCustom title="프로젝트 상세정보" columns={pjtColumns} data={[selectedPjt]} pagination={false}/>
                        </Card>
                    </div>

                    <div className={ps12Style.button_container}>
                        <CustomButton 
                            selected={content === 'chart'} 
                            onClick={() => handleButtonClick('chart')}
                        >
                            차트
                        </CustomButton>
                        <CustomButton 
                            selected={content === 'table'} 
                            onClick={() => handleButtonClick('table')}
                        >
                            표
                        </CustomButton>
                    </div>

                    <div className={sysStyles.main_grid}>
                        {content === 'chart' && 
                            <>
                                <Card className={saStyles.card_box} sx={{ width: "50%", height: "auto", borderRadius: "15px" }}>
                                    <ChartCustom title={"프로젝트 실적 차트"} data={chartPerfs} />
                                </Card>
                                <Card className={saStyles.card_box} sx={{ width: "50%", height: "auto", borderRadius: "15px" }}>
                                    <div className={psqStyles.title_container}>
                                        <div className={chartStyles.chart_title}>{"설비별 실적 차트"}</div>

                                        <Dropdown
                                            menu={{
                                                items,
                                                selectable: true,
                                                selectedKeys: [selectedMonth.key],
                                                onClick: handleMenuClick,
                                            }}
                                            placement="bottom"
                                        >
                                            <a className={chartStyles.chart_title} onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    {selectedMonth.label}
                                                    <DownOutlined />
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </div>

                                    <PieChart
                                        series={[
                                            {
                                                data: pieChartPerfs,
                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                cornerRadius: 3,
                                                //innerRadius: 50,
                                                outerRadius: 150,
                                                valueFormatter,
                                                //arcLabel: (item) => `${item.value}%`,
                                                arcLabelMinAngle: 35,
                                            },
                                        ]}
                                        height={300}
                                    />
                                </Card>
                            </>
                        }
                        {content === 'table' && 
                            <div className={psqStyles.table_container}>
                                <Card className={psqStyles.table_card} sx={{ width: "100%", height: "fit-contents", borderRadius: "15px" }}>
                                    <TableCustom columns={emissionPerfPjtColumns} title="배출원별 실적" data={emissionTableData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick("배출원별 실적", emissionTableData, emissionPerfPjtColumns)]} pagination={false} />
                                </Card>
                                <Card className={psqStyles.table_card} sx={{ width: "100%", height: "fit-contents", borderRadius: "15px" }}>
                                    <TableCustom columns={perfPjtColumns} title="scope별 실적" data={perfsData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick("scope별 실적", perfsData, perfPjtColumns)]} pagination={false} />
                                </Card>
                            </div>
                        }
                    </div>
                </>
            )}
        </div>
    );
}