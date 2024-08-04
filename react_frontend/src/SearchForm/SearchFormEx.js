import React from 'react';
import * as styles from '../assets/css/searchForm.css';
import { Form } from 'antd';
import DropDown from "../FormItem/DropDown";
import InputText from "../FormItem/InputText";
import SelectCalendar from "../FormItem/SelectCalendar";
import SearchAtModal from "../FormItem/SearchAtModal";
import SearchBtn from "../FormItem/SearchBtn";

/**
 * 모든 FormItem에
 * - name: FormItem의 값..?, 필수
 * - label: 조건명, 필수
 * - required: (true||false)
 * 지정 가능합니당
 * 
 * 추가로
 * SearchAtModal
 * - modalType: searchProject / searchLib (필수)
 * 
 * DropDown
 * - options: 드롭다운 내 옵션들, 필수
 * - defaultSelected: 기본으로 선택된 값이 있을지(true||false)
 * 
 * 
 * SearchBtn
 * - label: 기본값은 "조회"
 */

export default function SearchFormEx() {
    const selectOptions = [
        { value: '1', label: '안' },
        { value: '2', label: '녕' },
        { value: '3', label: '하' },
        { value: '4', label: '세' },
        { value: '5', label: '요' }
    ];

    return (
        <Form layout="vertical" className={styles.form_container}>
            <SearchAtModal name="searchProject" label="프로젝트명/코드" modalType='searchProject'/>
            <SearchAtModal name="searchProject2" label="필수 프로젝트명/코드" required={true} />
            <InputText name="email" label="이메일" />
            <DropDown name="1" label="드롭다운" options={selectOptions} />
            <DropDown name="2" label="필수 드롭다운" required={true} options={selectOptions} defaultSelected={true} />
            <SelectCalendar name="calendar" label="날짜선택" />

            <SearchBtn />
        </Form>
    );
};
