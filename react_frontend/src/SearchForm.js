import React, { useState } from 'react';
import * as styles from './assets/css/searchform.css'; // 네이밍 확인
import { Form } from 'antd';
import DropDown from "./FormItem/DropDown";
import InputText from "./FormItem/InputText";
import SelectCalendar from "./FormItem/SelectCalendar";
import SearchAtModal from "./FormItem/SearchAtModal";
import SearchBtn from "./FormItem/SearchBtn";

export default function SearchForm() {
    return (
        <Form layout="vertical" className={styles.form_container}>
            <SearchAtModal/>
            <InputText/>
            <DropDown/>
            <SelectCalendar/>

            <SearchBtn/>
        </Form>
    );
};
