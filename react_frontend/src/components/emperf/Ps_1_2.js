import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData";
// import InnerTabs from "../../InnerTabs";
import { Radio } from 'antd';
import {TableCustomDoubleClickEdit} from "../../TableCustom.js";
import { Card } from '@mui/material';
import * as mainStyle from '../../assets/css/main.css';
// import * as ps12Style from '../../assets/css/ps12.css';
import axiosInstance from '../../utils/AxiosInstance';
import { perfColumns } from '../../assets/json/tableColumn';

export default function Ps_1_2() {
    const [formFields, setFormFields] = useState(formField_ps12);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [usagePerfs, setUsagePerfs] = useState([]);
    const [amountUsedPerfs, setAmountUsedPerfs] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리

    const [content, setContent] = useState('actvQty'); // actvQty || fee
    const onRadioChange = (e) => {
        setContent(e.target.value);
    };

    // usagePerfs 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        console.log("usagePerfs");
    }, [usagePerfs]);
    // amountUsedPerfs 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        console.log("amountUsedPerfs");
    }, [amountUsedPerfs]);

    // 배출활동유형 드롭다운 옵션 설정
    const [emtnActvType, setEmtnActvType] = useState([]);
    useEffect(() => {
        const fetchEmtnActvTypeCode = async () => {
            try {
                const res = await axiosInstance.get("/sys/unit?unitType=배출활동유형");
                const options = res.data.map(emtnActvType => ({
                    value: emtnActvType.code,
                    label: emtnActvType.name,
                }));
                setEmtnActvType(options);
                const updateFormFields = formFields.map(field =>
                    field.name === 'emtnActvType' ? { ...field, options } : field
                );

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmtnActvTypeCode();
    }, []);

    // 프로젝트 선택 후 대상년도 드롭다운 옵션 설정
    const onProjectSelect = (selectedData, form) => {
        if (selectedData) {
            const yearOptions = [];
            const currentYear = new Date().getFullYear();
            const ctrtFrYear = selectedData.ctrtFrYear;
            const ctrtToYear = Math.min(selectedData.ctrtToYear, currentYear);

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

    const createPerfData = (perf, key) => {
        // 기본 구조 설정
        const perfData = {
            emissionId: perf.emissionId,
            equipName: perf.equipName,
            emtnActvType: perf.emtnActvType,
            emtnActvTypeName: perf.emtnActvTypeName,
            actvDataName: perf.actvDataName,
            inputUnitCode: key === 'formattedActvQty' ? perf.inputUnitCode : '원', // key에 따른 단위 설정
            quantityList: perf.quantityList,
        };

        // quantityList를 순회하며 월별 데이터를 추가
        perf.quantityList.forEach(item => {
            if (item && item.actvMth) {
                const monthKey = `${item.actvMth - 1}`;
                perfData[monthKey] = item[key];
            }
        });
        // 모든 월(1월부터 12월까지)의 데이터가 없을 경우 기본값으로 채워줌
        for (let month = 0; month < 12; month++) {
            const monthKey = `${month}`;
            if (!perfData.hasOwnProperty(monthKey)) {
                perfData[monthKey] = 0.0; // 데이터가 없는 경우 기본값 0.0 설정
            }
        }

        return perfData;
    };

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        let url = `/perf?pjtId=${data.searchProject.id}&actvYear=${data.actvYear}`;
        // emtnActvType이 존재하는 경우에만 URL에 추가
        if (data.emtnActvType) {
            url += `&emtnActvType=${data.emtnActvType}`;
        }
        const response = await axiosInstance.get(url);
        console.log(response.data);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            setUsagePerfs([]);
            setAmountUsedPerfs([]);
        } else {
            // 필요한 필드만 추출하여 설정
            const usageFilteredPerfs = response.data.map(perf => createPerfData(perf, 'formattedActvQty'));
            const amountUsedFilteredPerfs = response.data.map(perf => createPerfData(perf, 'formattedFee'));

            setUsagePerfs(usageFilteredPerfs);
            setAmountUsedPerfs(amountUsedFilteredPerfs);
        }
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"배출실적 > 활동량 관리"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit}
                //formFields={formFields} 
                formFields={formFields.map(field => field.name === 'actvYear' ? { ...field, disabled: actvYearDisabled, placeholder: actvYearDisabled ? '프로젝트를 선택하세요.' : '' } : field)} // actvYear 필드의 disabled 상태 반영
                onProjectSelect={onProjectSelect} />
            
            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
             ) : (
                <>
                    <Radio.Group
                        value={content}
                        onChange={onRadioChange}
                        style={{
                        marginBottom: 16,
                        }}
                    >
                        <Radio.Button value="actvQty">사용량</Radio.Button>
                        <Radio.Button value="fee">사용금액</Radio.Button>
                    </Radio.Group>

                    {content === 'actvQty' && <Usage data={usagePerfs} selectedYear={formData.actvYear} />}
                    {content === 'fee' && <AmountUsed data={amountUsedPerfs} selectedYear={formData.actvYear} />}
                </>
            )}
        </div>
    );
}


function Usage({ data, selectedYear }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        // 결과 처리
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onUploadExcelClick = () => {
        console.log("onUploadExcelClick");
        showModal();
    };

    const onDownloadExcelFormClick = (csvData) => {
        const fileName = `사용량 엑셀 양식_${selectedYear}`;

        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성 (perfColumns 순서대로, quantityList 제외, '년도' 맨앞에 추가)
        const headers = ['년도'].concat(
            perfColumns.filter(column => column.key !== 'quantityList')
                       .map(column => column.label)
        );
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = [`"${selectedYear}"`].concat(
                perfColumns.filter(column => column.key !== 'quantityList')
                           .map(column => {
                               const value = row[column.key] || '';
                               const escaped = ('' + value).replace(/"/g, '\\"');
                               return `"${escaped}"`;
                           })
            );
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
            <TableCustomDoubleClickEdit
                columns={perfColumns}
                title="실적목록"
                data={data}
                buttons={['Edit', 'UploadExcel', 'DownloadExcelForm']}
                onClicks={[() => {}, onUploadExcelClick, () => onDownloadExcelFormClick(data)]}
                modals={[
                    {
                        modalType: 'Ps12UploadExcel',
                        isModalOpen: isModalOpen,
                        handleOk: handleOk,
                        handleCancel: handleCancel
                    }
                ]}
                pageType="ps12actvQty"
            />
        </Card>
    )
}

function AmountUsed({ data, selectedYear }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        // 결과 처리
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onUploadExcelClick = () => {
        console.log("onUploadExcelClick2");
        showModal();
    };
    
    const onDownloadExcelFormClick = (csvData) => {
        const fileName = `사용금액 엑셀 양식_${selectedYear}`;

        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성 (perfColumns 순서대로, quantityList 제외, '년도' 맨앞에 추가)
        const headers = ['년도'].concat(
            perfColumns.filter(column => column.key !== 'quantityList')
                       .map(column => column.label)
        );
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = [`"${selectedYear}"`].concat(
                perfColumns.filter(column => column.key !== 'quantityList')
                           .map(column => {
                               const value = row[column.key] || '';
                               const escaped = ('' + value).replace(/"/g, '\\"');
                               return `"${escaped}"`;
                           })
            );
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
            <TableCustomDoubleClickEdit
                columns={perfColumns}
                title="실적목록"
                data={data}
                buttons={['Edit', 'UploadExcel', 'DownloadExcelForm']}
                onClicks={[() => {}, onUploadExcelClick, () => onDownloadExcelFormClick(data)]}
                modals={[
                    {
                        modalType: 'Ps12UploadExcel',
                        isModalOpen: isModalOpen,
                        handleOk: handleOk,
                        handleCancel: handleCancel
                    }
                ]}
                pageType="ps12fee"
            />
        </Card>
    )
}