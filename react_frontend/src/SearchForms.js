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

export default function SearchForms({ initialValues={}, onFormSubmit, formFields, autoSubmitOnInit=false, onProjectSelect=()=>{}, handleFieldsChange=()=>{}, handleEmptyFields=()=>{} }) {
    const [form] = Form.useForm();
    const [isInitialSubmit, setIsInitialSubmit] = useState(autoSubmitOnInit); // 첫 렌더링 여부를 추적하는 상태
    const [changedFieldsState, setChangedFieldsState] = useState({}); // InputText 필드 변경 여부 상태

    useEffect(() => {
        console.log("changedFieldsState", changedFieldsState)
    }, [changedFieldsState])
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
        
        // 조회 버튼이 눌리면 모든 필드의 변경 상태를 초기화하여 빨간색 배경을 없앰
        setChangedFieldsState({});
    };

    const handleProjectSelect = (selectedData) => {
        if (onProjectSelect) {
            onProjectSelect(selectedData, form); // form을 함께 전달
        }
    };

    const handleFieldsChangeWrapper = (changedFields, allFields) => {
        const updatedChangedFields = { ...changedFieldsState }; // 기존 상태 복사
        const shouldTriggerChange = !changedFields.some(field => {
            const fieldType = formFields.find(f => f.name === field.name[0])?.type;
            if (fieldType === 'InputText') {
                // InputText 필드가 변경되면 해당 필드의 이름을 true로 설정
                updatedChangedFields[field.name[0]] = true;
            }
            return fieldType === 'InputText'; // InputText가 포함된 경우 true 반환
        });

        setChangedFieldsState(updatedChangedFields); // 변경 상태 업데이트

        if (shouldTriggerChange) {
            handleFieldsChange(changedFields, allFields);
        }

        // 폼 필드 값이 모두 비어있을 경우 handleEmptyFields 호출
        const allFieldsValues = form.getFieldsValue();
        const allFieldsEmpty = Object.values(allFieldsValues).every(value => !value); // 모든 필드 값이 비어 있는지 확인

        if (allFieldsEmpty) {
            // handleEmptyFields가 함수 리스트인지 확인
            if (Array.isArray(handleEmptyFields)) {
                handleEmptyFields.forEach(fn => {
                    if (typeof fn === 'function') {
                        fn(); // 각 함수 호출
                    }
                });
            } else if (typeof handleEmptyFields === 'function') {
                setChangedFieldsState({});
                handleEmptyFields(); // 단일 함수 호출
            }
        }

        // handleEmptyFields 파라미터를 넘겼을경우(첫 렌더링시에 디폴트 리스트가 떠야하는 경우)
        if (handleEmptyFields && handleEmptyFields.length > 0) {
            
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

                        // InputText 필드의 변경 여부에 따라 배경색 변경
                        isChanged={changedFieldsState[field.name] || false}

                        // name이 'searchProject'인 경우에만 onProjectSelect 전달
                        onProjectSelect={field.name === 'searchProject' ? handleProjectSelect : ()=>{}} // 프로젝트 선택 시 대상년도 설정
                    />
                )
            })}
            <SearchBtn />
        </StyledForm>
    );
};