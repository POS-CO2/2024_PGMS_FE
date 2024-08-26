import React, { useState } from 'react';
import SearchForms from "../../../SearchForms";
import { formField_psq } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import * as mainStyle from '../../../assets/css/main.css';
import { Card } from '@mui/material';
import axiosInstance from '../../../utils/AxiosInstance';
import { perfPjtColumns } from '../../../assets/json/tableColumn';

export default function Psq() {
    const [formFields, setFormFields] = useState(formField_psq);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [tablePerfs, setTablePerfs] = useState([]);
    const [chartPerfs, setChartPerfs] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리

    // 프로젝트 선택 후 대상년도 드롭다운 옵션 설정
    const onProjectSelect = (selectedData, form) => {
        const ctrtFrYear = selectedData.ctrtFrYear;
        if (ctrtFrYear) {
            const currentYear = new Date().getFullYear();
            const yearOptions = [];

            // 계약년도부터 현재년도까지의 옵션 생성
            for (let year = currentYear; year > ctrtFrYear; year--) {
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

        let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
        const response = await axiosInstance.get(url);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setTablePerfs([{ 월: '', Scope1배출량: '', Scope2배출량: '', 총배출량: '' }]);
            setChartPerfs([
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 1' },
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 2' }
            ]);

        } else {
            // 필요한 필드만 추출하여 설정
            // 표
            const filteredTablePerfs = response.data.map(perf => ({
                actvMth: perf.actvMth,
                scope1: perf.scope1,
                scope2: perf.scope2,
                total: perf.total
            }));
            setTablePerfs(filteredTablePerfs);

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
            <SearchForms onFormSubmit={handleFormSubmit}
                formFields={formFields.map(field => field.name === 'actvYear' ? { ...field, disabled: actvYearDisabled, placeholder: actvYearDisabled ? '프로젝트를 선택하세요.' : '' } : field)} // actvYear 필드의 disabled 상태 반영
                onProjectSelect={onProjectSelect} />
            
            {(!formData || Object.keys(formData).length === 0) ?
                <></> : (
                    <InnerTabs items={[
                        { label: '차트', key: '1', children: <ChartTab data={chartPerfs} /> },
                        { label: '표', key: '2', children: <TableTab data={tablePerfs} />, },
                    ]} />
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

function TableTab({ data }) {
    const onDownloadExcelClick = () => {
        console.log("onDownloadExcelClick");
    };

    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <TableCustom columns={perfPjtColumns} title="프로젝트 실적 표" data={data} buttons={['DownloadExcel']} onClicks={[onDownloadExcelClick]} />
        </Card>
    )
}