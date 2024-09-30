import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { emissionSourceForm } from '../../atoms/searchFormAtoms';
import { ps12SelectedBtnState } from '../../atoms/buttonAtoms';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData";
import TableCustom, {TableCustomDoubleClickEdit} from "../../TableCustom.js";
import { Card, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as mainStyle from '../../assets/css/main.css';
import * as ps12Style from '../../assets/css/ps12.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as esmStyles from '../../assets/css/esm.css';
import * as pdsStyles from "../../assets/css/pds.css";
import axiosInstance from '../../utils/AxiosInstance';
import { perfColumns, pjtColumns } from '../../assets/json/tableColumn';
import * as XLSX from 'xlsx';

export const CustomButton = styled(Button)(({ theme, selected }) => ({
    color: selected ? '#000' : '#B6B6B6',
    border: selected ? '0.1rem solid #0A7800' : '0.1rem solid transparent', // 기본적으로 테두리 공간을 차지
    backgroundColor: selected ? '#fff' : 'transparent',
    fontWeight: selected ? 'bolder' : 'normal',
    borderRadius: '1.3rem',
    fontSize: '1rem',
    paddingTop: '0.1rem',
    paddingBottom: '0.1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',

    '&:hover': {
        color: '#000',
        backgroundColor: '#fff',
        border: '0.1rem solid #0A7800',
        borderRadius: '1.3rem',
        fontWeight: 'bolder',
    },
}));

export default function Ps_1_2() {
    const [formFields, setFormFields] = useState(formField_ps12);
    const [formData, setFormData] = useRecoilState(emissionSourceForm);
    const [selectedPjt, setSelectedPjt] = useState([]);
    const [usagePerfs, setUsagePerfs] = useState([]);
    const [amountUsedPerfs, setAmountUsedPerfs] = useState([]);
    const [emtnActvType, setEmtnActvType] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리
    const [content, setContent] = useRecoilState(ps12SelectedBtnState);

    // 특정 필드만 업데이트하는 함수
    const updateFormField = (fieldName, newProperties) => {
        setFormFields(prevFields => 
            prevFields.map(field =>
                field.name === fieldName ? { ...field, ...newProperties } : field
            )
        );
    };

    // 배출활동유형 드롭다운 옵션 설정
    useEffect(() => {
        const fetchEmtnActvTypeCode = async () => {
            try {
                const res = await axiosInstance.get("/sys/unit?unitType=배출활동유형");
                const options = res.data.map(emtnActvType => ({
                    value: emtnActvType.code,
                    label: emtnActvType.name,
                }));
                setEmtnActvType(options);
                
                // emtnActvType 필드만 업데이트
                updateFormField('emtnActvType', { options });
                setFormFields(prevFields => prevFields);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmtnActvTypeCode();

        // formData값이 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        if(Object.keys(formData).length !== 0) {
            handleFormSubmit(formData);
        }
        handleButtonClick(content);
    }, []);

    const handleButtonClick = (value) => {
        setContent(value);
    };

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

            // 옵션 데이터가 있으면 드롭다운을 활성화, default값 설정
            if (yearOptions.length > 0) {
                setActvYearDisabled(false);
            }
            if (Object.keys(formData).length === 0) {
                form.setFieldsValue({ actvYear: yearOptions[0].value });
            }

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
        setSelectedPjt(data.searchProject);

        let url = `/perf?pjtId=${data.searchProject.id}&actvYear=${data.actvYear}`;
        // emtnActvType이 존재하는 경우에만 URL에 추가
        if (data.emtnActvType) {
            url += `&emtnActvType=${data.emtnActvType}`;
        }
        const response = await axiosInstance.get(url);

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

    // 서치폼이 변경될 때 목록 clear
    const handleFieldsChange = () => {
        setFormData({});
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
            const fileName = `사용량 엑셀 양식_${formData.searchProject.pjtName}_${formData.actvYear}`;
    
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
                buttons={['DoubleClickEdit', 'DownloadExcelForm', 'UploadExcel']}
                onClicks={[() => {}, () => onDownloadExcelFormClick(data), onUploadExcelClick]}
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
            const fileName = `사용금액 엑셀 양식_${formData.searchProject.pjtName}_${formData.actvYear}`;
    
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
                buttons={['DoubleClickEdit', 'DownloadExcelForm', 'UploadExcel']}
                onClicks={[() => {}, () => onDownloadExcelFormClick(data), onUploadExcelClick]}
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
                initialValues={formData} 
                onFormSubmit={handleFormSubmit}
                formFields={formFields.map(field => field.name === 'actvYear' ? { ...field, disabled: actvYearDisabled } : field)} // actvYear 필드의 disabled 상태 반영
                onProjectSelect={onProjectSelect} 
                handleFieldsChange={handleFieldsChange}
            />
            
            {(!formData || Object.keys(formData).length === 0) ? 
                <></> :
                <div className={pdsStyles.main_grid}>
                    <Card sx={{ height: "auto", padding: "0.5rem", borderRadius: "0.5rem" }}>
                        <div className={pdsStyles.table_title} style={{ padding: "0 1rem"}}>프로젝트 상세정보</div>

                        <div className={pdsStyles.row} style={{ padding: "0.5rem 1rem" }}>
                            <div className={pdsStyles.pjt_data_container}>프로젝트 지역
                                <div className={pdsStyles.code}>{selectedPjt.pjtType} / {selectedPjt.regCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>계약일
                                <div className={pdsStyles.code}>{selectedPjt.ctrtFrYear} / {selectedPjt.ctrtFrMth} ~ {selectedPjt.ctrtToYear} / {selectedPjt.ctrtToMth}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>본부명
                                <div className={pdsStyles.code}>{selectedPjt.divCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>연면적(m²)
                                <div className={pdsStyles.code}>{selectedPjt.bldArea}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>진행상태
                                <div className={pdsStyles.code}>{selectedPjt.pjtProgStus}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>분류
                                <div className={pdsStyles.code}>{selectedPjt.prodTypeCode}</div>
                            </div>
                        </div>
                    </Card>
                    
                    <div className={pdsStyles.button_container}>
                        <CustomButton 
                            selected={content === 'actvQty'} 
                            onClick={() => handleButtonClick('actvQty')}
                        >
                            사용량
                        </CustomButton>
                        <CustomButton 
                            selected={content === 'fee'} 
                            onClick={() => handleButtonClick('fee')}
                        >
                            사용금액
                        </CustomButton>
                    </div>
                    <div className={pdsStyles.contents_container}>
                        <Card sx={{ width: "100%", height: "auto", borderRadius: "0.5rem" }}>
                            {content === 'actvQty' && <Usage data={usagePerfs} />}
                            {content === 'fee' && <AmountUsed data={amountUsedPerfs} />}
                        </Card>
                    </div>
                </div>
            }
        </div>
    );
}