import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { emissionSourceForm, selectedPjtFPState } from '../../atoms/searchFormAtoms';
import { ps12SelectedBtnState } from '../../atoms/buttonAtoms';
import SearchForms from "../../SearchForms";
import { formField_ps12_fp } from "../../assets/json/searchFormData";
import { CustomButton } from './Ps_1_2';
import TableCustom, {TableCustomDoubleClickEdit} from "../../TableCustom.js";
import { Card } from '@mui/material';
import * as mainStyle from '../../assets/css/main.css';
import * as ps12Style from '../../assets/css/ps12.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as esmStyles from '../../assets/css/esm.css';
import axiosInstance from '../../utils/AxiosInstance';
import { perfColumns, pjtColumns } from '../../assets/json/tableColumn';
import * as pdsStyles from "../../assets/css/pds.css";
import * as XLSX from 'xlsx';

export default function Ps_1_2_Fp() {
    const [formFields, setFormFields] = useState(formField_ps12_fp);
    const [formData, setFormData] = useRecoilState(emissionSourceForm);
    const [selectedPjtOption, setSelectedPjtOption] = useState([]);
    const [selectedPjt, setSelectedPjt] = useState({});
    const [selectedPjtId, setSelectedPjtId] = useRecoilState(selectedPjtFPState);
    const [usagePerfs, setUsagePerfs] = useState([]);
    const [amountUsedPerfs, setAmountUsedPerfs] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리
    const [pjtOptions, setPjtOptions] = useState([]);
    const [projectData, setProjectData] = useState([]);  // 전체 프로젝트 데이터를 저장
    const [emtnActvType, setEmtnActvType] = useState([]);
    const [content, setContent] = useRecoilState(ps12SelectedBtnState); // actvQty || fee

    const handleButtonClick = (value) => {
        setContent(value);
    };

    // formData의 searchProject 값만 변경하는 함수
    const updateSearchProject = (newValue) => {
        setFormData((prevFormData) => ({
        ...prevFormData,
        searchProject: newValue,  // searchProject 값만 업데이트
        }));
    };

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
    
        // 프로젝트 옵션 불러오기 처리 후 다음 로직 실행
        const fetchDataAndContinue = async () => {
            await fetchPjtOptions();  // fetchPjtOptions 호출 후 대기

            // fetchPjtOptions 완료 후 실행될 로직
            if (selectedPjtId) {
                if (selectedPjtId !== selectedPjt.id) {
                    updateSearchProject(selectedPjtId);
                } else {
                    handleFormSubmit(formData);
                }
            }

            handleButtonClick(content);
        };

        fetchDataAndContinue();  // 함수 호출
    }, [projectData.length]);

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
            }
            if (Object.keys(formData).length === 0 || selectedProject) {
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

        let perfRequrl = `/perf?pjtId=${data.searchProject}&actvYear=${data.actvYear}`;
        // emtnActvType이 존재하는 경우에만 URL에 추가
        if (data.emtnActvType) {
            perfRequrl += `&emtnActvType=${data.emtnActvType}`;
        }

        const pjtRes = await axiosInstance.get(`/pjt?pgmsYn=y&id=${data.searchProject}`);
        const perfRes = await axiosInstance.get(perfRequrl);

        setSelectedPjt(pjtRes.data[0]);
        setSelectedPjtId(data.searchProject);
    
        // data가 빈 배열인지 확인
        if (perfRes.data.length === 0) {
            setUsagePerfs([]);
            setAmountUsedPerfs([]);
        } else {
            // 필요한 필드만 추출하여 설정
            const usageFilteredPerfs = perfRes.data.map(perf => createPerfData(perf, 'formattedActvQty'));
            const amountUsedFilteredPerfs = perfRes.data.map(perf => createPerfData(perf, 'formattedFee'));

            setUsagePerfs(usageFilteredPerfs);
            setAmountUsedPerfs(amountUsedFilteredPerfs);
        }
    };

    // 서치폼이 변경될 때 목록 clear
    const handleFieldsChange = () => {
        setSelectedPjt({});
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
                immutableCellIndex={[0, 1, 2, 3]}
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
                immutableCellIndex={[0, 1, 2, 3]}
            />
        )
    }

    return (
        <div>
            <div className={mainStyle.breadcrumb}>배출실적 &gt; 활동량 관리</div>
            <SearchForms
                initialValues={formData}
                onFormSubmit={handleFormSubmit}
                formFields={formFields.map(field => field.name === 'actvYear' ? { ...field, disabled: actvYearDisabled } : field)} // actvYear 필드의 disabled 상태 반영
                onProjectSelect={onProjectSelect} 
                handleFieldsChange={handleFieldsChange}
            />
            
            {(!selectedPjt || Object.keys(selectedPjt).length === 0) ? 
                <></> :
                <div className={pdsStyles.main_grid}>
                    <Card sx={{ height: "auto", padding: "0.5rem", borderRadius: "0.5rem" }}>
                        <div className={pdsStyles.table_title} style={{ padding: "0 1rem"}}>프로젝트 상세정보</div>

                        <div className={pdsStyles.row} style={{ padding: "0.5rem 1rem"}}>
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