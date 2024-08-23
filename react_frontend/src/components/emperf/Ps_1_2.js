import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData"
import InnerTabs from "../../InnerTabs";
import TableCustom from "../../TableCustom.js";
import { Card } from '@mui/material';
import * as mainStyle from '../../assets/css/main.css';
// import * as ps12Style from '../../assets/css/ps12.css';
import axiosInstance from '../../utils/AxiosInstance';

export default function Ps_1_2() {
    const [formFields, setFormFields] = useState(formField_ps12);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [perfs, setPerfs] = useState([]);
    const [actvYearDisabled, setActvYearDisabled] = useState(true);  // 드롭다운 비활성화 상태 관리

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
                    field.name === 'emtnActvType' ? {...field, options } : field
                );

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmtnActvTypeCode();
    },[]);

    // 프로젝트 선택 후 대상년도 드롭다운 옵션 설정
    const onProjectSelect = (selectedData) => {
        const ctrtFrYear = selectedData.프로젝트시작년;
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
        }
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

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderPerf = {
                emissionId: '',
                설비명: '',
                배출활동유형: '',
                활동자료: '',
                단위: '',
                '1월': '',
                '2월': '',
                '3월': '',
                '4월': '',
                '5월': '',
                '6월': '',
                '7월': '',
                '8월': '',
                '9월': '',
                '10월': '',
                '11월': '',
                '12월': ''
            };

            // 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setPerfs([placeholderPerf]);
        } else {
            // 필요한 필드만 추출하여 설정
            const filteredPerfs = response.data.map(perf => {
                // 기본적인 구조를 설정
                const perfData = {
                    id: perf.emissionId,
                    설비명: perf.equipName,
                    배출활동유형: perf.emtnActvType,
                    활동자료: perf.actvDataName,
                    단위: perf.inputUnitCode,
                };

                // quantityList를 순회하며 월별 데이터를 추가
                perf.quantityList.forEach(item => {
                    if (item && item.actvMth) {
                        perfData[`${item.actvMth}월`] = item.actvQty;
                    }
                });

                // 모든 월(1월부터 12월까지)의 데이터가 없을 경우 기본값으로 채워줌
                for (let month = 1; month <= 12; month++) {
                    const monthKey = `${month}월`;
                    if (!perfData.hasOwnProperty(monthKey)) {
                        perfData[monthKey] = 0.0;  // 데이터가 없는 경우 기본값 0.0 설정
                    }
                }

                return perfData;
            });

            setPerfs(filteredPerfs);
        }
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"배출실적 > 활동량 관리"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit} 
            //formFields={formFields} 
            formFields={formFields.map(field => field.name === 'actvYear' ? {...field, disabled: actvYearDisabled, placeholder: actvYearDisabled ? '프로젝트를 선택하세요.' : '' } : field)} // actvYear 필드의 disabled 상태 반영
            onProjectSelect={onProjectSelect} />

            {(!formData || Object.keys(formData).length === 0) ?
                <></> : (
                    <InnerTabs items={[
                        { label: '사용량', key: '1', children: <Usage data={perfs} />, },
                        { label: '사용금액', key: '2', children: <AmountUsed data={perfs} />, },
                    ]} />
                )}
        </div>
    );
}


function Usage({ data }) {

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
    const onDownloadExcelFormClick = () => {
        console.log("onDownloadExcelFormClick");
    };

    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <TableCustom
                title="실적목록"
                data={data}
                buttons={['UploadExcel', 'DownloadExcelForm']}
                onClicks={[onUploadExcelClick, onDownloadExcelFormClick]}
                modals={[
                    {
                        modalType: 'Ps12UploadExcel',
                        isModalOpen: isModalOpen,
                        handleOk: handleOk,
                        handleCancel: handleCancel
                    }
                ]}
            />
        </Card>
    )
}

function AmountUsed({ data }) {

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
    const onDownloadExcelFormClick = () => {
        console.log("onDownloadExcelFormClick2");
    };

    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <TableCustom
                title="실적목록"
                data={data}
                buttons={['UploadExcel', 'DownloadExcelForm']}
                onClicks={[onUploadExcelClick, onDownloadExcelFormClick]}
                modals={[
                    {
                        modalType: 'Ps12UploadExcel',
                        isModalOpen: isModalOpen,
                        handleOk: handleOk,
                        handleCancel: handleCancel
                    }
                ]}
            />
        </Card>
    )
}