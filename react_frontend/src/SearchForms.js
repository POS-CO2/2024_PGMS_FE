import React from 'react';
import * as searchFormStyles from './assets/css/searchForm.css';
import { Dropdown, Form } from 'antd';
import DropDown from "./FormItem/DropDown";
import InputText from "./FormItem/InputText";
import SelectCalendar from "./FormItem/SelectCalendar";
import SearchAtModal from "./FormItem/SearchAtModal";
import SearchBtn from "./FormItem/SearchBtn";

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

const formItemComponents = {
    DropDown,
    InputText,
    SelectCalendar,
    SearchAtModal
};

export default function SearchForms({ onFormSubmit, formFields }) {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onFormSubmit(values);
    };

    return (
        <Form form={form} layout="vertical" className={searchFormStyles.form_container} onFinish={handleFinish}>
            {formFields.map((field, index) => {
                const FormItemComponent = formItemComponents[field.type];
                return (
                    <FormItemComponent
                        key={index}
                        name={field.name}
                        label={field.label}
                        required={field.required}
                        modalType={field.modalType}
                        options={field.options}
                        form={form}
                        defaultSelected={field.defaultSelected}
                    />
                )
            })};
            {/* <SearchAtModal name="searchProject" label="프로젝트명/코드" modalType='프로젝트 찾기' form={form} />
            <SearchAtModal name="searchLib" label="설비LIB명" modalType='설비LIB 찾기' form={form} />
            <SearchAtModal name="ModalTest" label="default" required={true} form={form} />
            <InputText name="email" label="이메일" />
            <DropDown name="dropDown1" label="드롭다운" options={selectOptions} />
            <DropDown name="dropDown2" label="필수 드롭다운" required={true} options={selectOptions} defaultSelected={true} />
            <SelectCalendar name="calendar" label="날짜선택" /> */}
            <SearchBtn />
        </Form>
    );
};

// 프로젝트코드/명 only
export function SearchFormPd() {
    return (
        <Form layout="vertical" className={searchFormStyles.form_container}>
            <SearchAtModal name="searchProject2" label="프로젝트코드/명" required={true} />
            <SearchBtn />
        </Form>
    );
}

export function SearchForm_Ps_1_2({ onFormSubmit }) {
    const selectYears = [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ];
    const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' }
    ];

    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onFormSubmit(values);
    };

    return (
        <Form form={form} layout="vertical" className={searchFormStyles.form_container} onFinish={handleFinish}>
            <SearchAtModal name="searchProject" label="프로젝트코드/명" required={true} modalType='프로젝트 찾기' form={form} />
            <DropDown name="selectYears" label="대상년도" required={true} options={selectYears} defaultSelected={true} />
            <DropDown name="emissionActivityType" label="배출활동유형" options={selectOptions} />

            <SearchBtn />
        </Form>
    );
}
