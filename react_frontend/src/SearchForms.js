import React from 'react';
import * as searchFormStyles from './assets/css/searchForm.css';
import { Form } from 'antd';
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

export default function SearchForms({ onFormSubmit, formFields, onSearch }) {
    const [form] = Form.useForm();

    // 조회 버튼 클릭 시 호출될 함수
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
            })}
            <SearchBtn onClick={onSearch}/>
        </Form>
    );
};