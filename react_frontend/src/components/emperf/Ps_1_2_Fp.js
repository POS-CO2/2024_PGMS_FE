import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12_fp } from "../../assets/json/searchFormData";
import { Radio } from 'antd';
import TableCustom, {TableCustomDoubleClickEdit} from "../../TableCustom.js";
import { Card } from '@mui/material';
import * as mainStyle from '../../assets/css/main.css';
import * as ps12Style from '../../assets/css/ps12.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as esmStyles from '../../assets/css/esm.css';
import axiosInstance from '../../utils/AxiosInstance';
import { perfColumns, pjtColumns } from '../../assets/json/tableColumn';
import styled from 'styled-components';
import * as XLSX from 'xlsx';

const CustomRadioGroup = styled(Radio.Group)`
    .ant-radio-button-wrapper:hover {
        background-color: #FFFFFF;
        color: #0EAA00;
        border-color: #0EAA00;
    }

    .ant-radio-button-wrapper:not(:first-child)::before {
        background-color: #0EAA00; /* Line between buttons */
    }

    .ant-radio-button-wrapper-checked {
        background-color: #0EAA00 !important;
        color: white;
        border-color: #0EAA00 !important;
    }

    .ant-radio-button-wrapper-checked:hover {
        background-color: #FFFFFF;
        color: white;
        border-color: #0EAA00 !important;
    }
`;

export default function Ps_1_2_Fp() {
    const [formFields, setFormFields] = useState(formField_ps12_fp);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [selectedPjtOption, setSelectedPjtOption] = useState([]);
    const [selectedPjt, setSelectedPjt] = useState([]);
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

    const [pjtOptions, setPjtOptions] = useState([]);
    const [projectData, setProjectData] = useState([]);  // 전체 프로젝트 데이터를 저장
    const [emtnActvType, setEmtnActvType] = useState([]);
    useEffect(() => {
        const fetchPjtOptions = async () => {
            try {
                const [pjtRes, emtnActvTypeRes] = await Promise.all([
                    axiosInstance.get("/pjt/my"),
                    axiosInstance.get("/sys/unit?unitType=배출활동유형")
                ]);
    
                // 프로젝트 드롭다운 옵션 설정
                setProjectData(pjtRes.data); // 전체 프로젝트 데이터를 저장
                const pjtOptions = pjtRes.data.map(pjt => ({
                    value: pjt.pjtId, // value에 id만 전달
                    label: pjt.pjtCode +"/"+ pjt.pjtName,
                }));
                setPjtOptions(pjtOptions);
    
                // 배출활동유형 드롭다운 옵션 설정
                const emtnActvTypeOptions = emtnActvTypeRes.data.map(emtnActvType => ({
                    value: emtnActvType.code,
                    label: emtnActvType.name,
                }));
                setEmtnActvType(emtnActvTypeOptions);
    
                // formFields 업데이트
                const updateFormFields = formFields.map(field => {
                    if (field.name === 'searchProject') {
                        return { ...field, options: pjtOptions };
                    } else if (field.name === 'emtnActvType') {
                        return { ...field, options: emtnActvTypeOptions };
                    }
                    return field;
                });
    
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
        setSelectedPjt(selectedPjtOption);

        let url = `/perf?pjtId=${data.searchProject}&actvYear=${data.actvYear}`;
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

    function Usage({ data }) {

        const [isModalOpen, setIsModalOpen] = useState(false);
        const showModal = () => {
            setIsModalOpen(true);
        };
        const handleOk = (data) => {
            handleFormSubmit(formData);
            setIsModalOpen(false);
        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };
    
        const onUploadExcelClick = () => {
            showModal();
        };
    
        const onDownloadExcelFormClick = (csvData) => {
            const fileName = `사용량 엑셀 양식_${selectedPjt.pjtName}_${formData.actvYear}`;
    
            // 워크북 및 워크시트 생성
            const wb = XLSX.utils.book_new();
            const wsData = [];
            
            // 헤더 생성 (perfColumns 순서대로, quantityList 제외, '년도' 맨앞에 추가)
            const headers = ['년도'].concat(
                perfColumns.filter(column => column.key !== 'quantityList')
                        .map(column => column.label)
            );
            wsData.push(headers);
            
            // 데이터 생성
            for (const row of csvData) {
                const values = [formData.actvYear].concat(
                    perfColumns.filter(column => column.key !== 'quantityList')
                               .map(column => {
                                    let value = row[column.key] || '';
                                    // value가 문자열인지 확인 후 ',' 제거
                                    if (typeof value === 'string') {
                                        value = value.replace(/,/g, '');
                                    }
                                    return value;
                               })
                );
                wsData.push(values);
            }
            
            // 워크시트에 데이터 추가
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // 파일 다운로드
            XLSX.writeFile(wb, `${fileName}.xlsx`);
        };
    
        return (
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
                handleFormSubmit={handleFormSubmit}
                formData={formData}
            />
        )
    }
    
    function AmountUsed({ data }) {
    
        const [isModalOpen, setIsModalOpen] = useState(false);
        const showModal = () => {
            setIsModalOpen(true);
        };
        const handleOk = (data) => {
            handleFormSubmit(formData);
            setIsModalOpen(false);
        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };
    
        const onUploadExcelClick = () => {
            showModal();
        };
        
        const onDownloadExcelFormClick = (csvData) => {
            const fileName = `사용금액 엑셀 양식_${selectedPjt.pjtName}_${formData.actvYear}`;
    
            // 워크북 및 워크시트 생성
            const wb = XLSX.utils.book_new();
            const wsData = [];

            // 헤더 생성 (perfColumns 순서대로, quantityList 제외, '년도' 맨앞에 추가)
            const headers = ['년도'].concat(
                perfColumns.filter(column => column.key !== 'quantityList')
                           .map(column => column.label)
            );
            wsData.push(headers);
            
            // 데이터 생성
            for (const row of csvData) {
                const values = [formData.actvYear].concat(
                    perfColumns.filter(column => column.key !== 'quantityList')
                            .map(column => {
                                let value = row[column.key] || '';
                                // value가 문자열인지 확인 후 ',' 제거
                                if (typeof value === 'string') {
                                    value = value.replace(/,/g, '');
                                }
                                return value;
                            })
                );
                wsData.push(values);
            }
            
            // 워크시트에 데이터 추가
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // 파일 다운로드
            XLSX.writeFile(wb, `${fileName}.xlsx`);
        };
    
        return (
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
                handleFormSubmit={handleFormSubmit}
                formData={formData}
            />
        )
    }

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"배출실적 > 활동량 관리"}
            </div>

            <SearchForms
                onFormSubmit={handleFormSubmit}
                formFields={formFields.map(field => field.name === 'actvYear' ? { ...field, disabled: actvYearDisabled, placeholder: actvYearDisabled ? '프로젝트를 선택하세요.' : '' } : field)} // actvYear 필드의 disabled 상태 반영
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
                    
                    <CustomRadioGroup
                        options={[{label: '사용량', value: 'actvQty'}, {label: '사용금액', value: 'fee'}]}
                        onChange={onRadioChange}
                        value={content}
                        optionType="button"
                        buttonStyle="solid"
                        className={ps12Style.custom_radio_group}
                    />
                    <div className={sysStyles.main_grid}>
                        <Card className={sysStyles.card_box} sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                            {content === 'actvQty' && <Usage data={usagePerfs} />}
                            {content === 'fee' && <AmountUsed data={amountUsedPerfs} />}
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}