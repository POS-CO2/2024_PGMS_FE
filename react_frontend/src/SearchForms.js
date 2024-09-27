import React, { useEffect, useState } from 'react';
import * as searchFormStyles from './assets/css/searchForm.css';
import { Form } from 'antd';
import DropDown from "./FormItem/DropDown";
import InputText from "./FormItem/InputText";
import InputYear from "./FormItem/InputYear";
import SelectCalendar from "./FormItem/SelectCalendar";
import SearchAtModal from "./FormItem/SearchAtModal";
import SearchBtn from "./FormItem/SearchBtn";
import styled from 'styled-components';
import { ContinuousColorLegend } from '@mui/x-charts';

/**
 * 모든 FormItem에
 * - name: FormItem의  ID..?, *필수*
 * - label: 조건명, *필수*
 * - required: (true||false)
 * 지정 가능합니당
 * 
 * 추가로
 * SearchAtModal
 * - modalType: "프로젝트 찾기" / "설비LIB 찾기"
 * - form={form} 속성 주기
 * 
 * DropDown
 * - options: 드롭다운 내 옵션들, *필수*
 * - defaultSelected: 기본으로 선택된 값이 있을지(true||false)
 * 
 * 
 * SearchBtn
 * - label: 기본값은 "조회"
 */

const StyledForm = styled(Form)`
    .ant-input{
        font-family: SUITE-Regular;
    }

    .ant-form-item{
        font-family: SUITE-Regular;
    }

    .ant-form-item-label{
        font-family: SUITE-Regular;
    }

    .ant-form-item-required{
        font-family: SUITE-Regular;
    }

    .ant-select-selection-item{
        font-family: SUITE-Regular;
    }
`; 

const formItemComponents = {
    DropDown,
    InputText,
    InputYear,
    SelectCalendar,
    SearchAtModal
};

export default function SearchForms({ initialValues={}, onFormSubmit, formFields, autoSubmitOnInit=false, onProjectSelect=()=>{}, handleFieldsChange=()=>{} }) {
    const [form] = Form.useForm();
    const [isInitialSubmit, setIsInitialSubmit] = useState(autoSubmitOnInit); // 첫 렌더링 여부를 추적하는 상태

    // 폼 초기값 설정
    useEffect(() => {
        form.setFieldsValue(initialValues);
        if(Object.keys(initialValues).length !== 0) {
            onProjectSelect(initialValues.searchProject, form)
        }
    }, [initialValues]);

    // 초기 렌더링 시 폼을 제출하는 함수 //default일 때 자동 폼 제출
    const autoSubmitForm = () => {
        form.validateFields()
            .then(values => {
                onFormSubmit(values);
                setIsInitialSubmit(false); // 초기 제출 후 상태 업데이트
            })
            .catch(info => {
                console.log('Validation Failed:', info);
            });
    };

    // 초기 렌더링 시에만 폼 제출
    useEffect(() => {
        if (isInitialSubmit) {
            autoSubmitForm();
        }
    }, []);

    // 조회 버튼 클릭 시 호출될 함수
    const handleFinish = (values) => {
        onFormSubmit(values);
    };

    const handleProjectSelect = (selectedData) => {
        if (onProjectSelect) {
            onProjectSelect(selectedData, form); // form을 함께 전달
        }
    };

    const handleFieldsChangeWrapper = (changedFields, allFields) => {
        const shouldTriggerChange = !changedFields.some(field => {
            // 변경된 필드 중 InputText 타입이 있는지 확인
            const fieldType = formFields.find(f => f.name === field.name[0])?.type;
            return fieldType === 'InputText';
        });
    
        if (shouldTriggerChange) {
            handleFieldsChange(changedFields, allFields);
        }
    };

    return (
        <StyledForm 
            form={form} 
            layout="vertical" 
            className={searchFormStyles.form_container} 
            onFinish={handleFinish}
            onFieldsChange={handleFieldsChangeWrapper}
        >
            {formFields.map((field, index) => {
                const FormItemComponent = formItemComponents[field.type];
                return (
                    <FormItemComponent
                        key={index}
                        initialValues={initialValues}
                        name={field.name}
                        label={field.label}
                        required={field.required}
                        modalType={field.modalType}
                        options={field.options}
                        form={form}
                        defaultSelected={field.defaultSelected}

                        disabled={field.disabled} // disabled 상태 전달
                        placeholder={field.placeholder} // placeholder 전달

                        // name이 'searchProject'인 경우에만 onProjectSelect 전달
                        onProjectSelect={field.name === 'searchProject' ? handleProjectSelect : ()=>{}} // 프로젝트 선택 시 대상년도 설정
                    />
                )
            })}
            <SearchBtn />
        </StyledForm>
    );
};