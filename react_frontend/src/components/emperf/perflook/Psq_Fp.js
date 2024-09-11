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
import { Card } from '@mui/material';
import axiosInstance from '../../../utils/AxiosInstance.js';
import { perfPjtColumns, pjtColumns } from '../../../assets/json/tableColumn.js';

export default function Psq_Fp() {
    const [formFields, setFormFields] = useState(formField_psq_fp);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [selectedPjtOption, setSelectedPjtOption] = useState([]);
    const [selectedPjt, setSelectedPjt] = useState([]);
    const [perfsData, setPerfsData] = useState([]);
    const [chartPerfs, setChartPerfs] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리

    const [content, setContent] = useState('chart'); // chart || table
    const handleButtonClick = (value) => {
        setContent(value);
    };

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

            // 옵션 데이터가 있으면 드롭다운을 활성화
            setActvYearDisabled(yearOptions.length === 0);

            // actvYear 필드 리셋
            form.resetFields(['actvYear']);
        }
    };

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);
        setSelectedPjt(selectedPjtOption);

        let url = `/perf/pjt?pjtId=${data.searchProject}&year=${data.actvYear}`;
        const response = await axiosInstance.get(url);
        setPerfsData(response.data);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setChartPerfs([
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
            setChartPerfs(formattedChartPerfs);
        }
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
                            <TableCustom title="조회결과" columns={pjtColumns} data={[selectedPjt]} pagination={false}/>
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
                        <Card className={sysStyles.card_box} sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                            {content === 'chart' && <ChartTab data={chartPerfs} />}
                            {content === 'table' && <TableTab data={perfsData} pjtName={formData.searchProject.pjtName} />}
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

function ChartTab({ data }) {
    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <ChartCustom title={"프로젝트 실적 차트"} data={data} />
        </Card>
    )
}

function TableTab({ data, pjtName }) {
    const onDownloadExcelClick = (csvData) => {
        const year = csvData[0].actvYear;
        const fileName = `실적_${pjtName}_${year}`;

        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성
        const headers = Object.keys(csvData[0]);
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
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
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <TableCustom columns={perfPjtColumns} title="프로젝트 실적 표" data={data} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(data)]} />
        </Card>
    )
}