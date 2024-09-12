import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ea } from "../../assets/json/searchFormData";
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

import { libData, typeData, sourceData } from '../../assets/json/saDataEx';

export default function Ea() {
    const [formData, setFormData] = useState(); // 검색 데이터
    //const [salesTableData, setSalesTableData] = useState([]); // 목록 표
    const [analEquipData, setAnalEquipData] = useState([]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        switch (data.selected) {
            case "설비LIB":
                //let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
                setAnalEquipData(libData);
                break;
    
            case "설비유형":
                //let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
                setAnalEquipData(typeData);
                break;
    
            case "에너지원":
                //let url = `/perf/pjt?pjtId=${data.searchProject.id}&year=${data.actvYear}`;
                setAnalEquipData(sourceData);
                break;
    
            default:
                console.log("알 수 없는 선택입니다.");
                setAnalEquipData([]);
                break;
        }

        const response = await axiosInstance.get(url);

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
                {"분석및예측 > 설비별 분석"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ea} />

            
        </div>
    );
}