import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function SelectCalendar({ name, label, required=false, isAnal=false }) {

    const customMonthRender = (current) => {
        return (
            <div className="ant-picker-cell-inner">
                {dayjs(current).format('M')}월
            </div>
        );
    };

    // 현재 월의 전 월까지만 선택 가능하도록 설정
    const disabledDate = (current) => {
        // 현재 월의 첫 날
        const startOfCurrentMonth = dayjs().startOf('month');
        // 현재 월의 전 월의 마지막 날
        const endOfLastMonth = startOfCurrentMonth.subtract(1, 'day');

        // 현재 날짜가 전 월의 마지막 날보다 크면 비활성화
        return current.isAfter(endOfLastMonth);
    };

    return (
        <ConfigProvider locale={{ locale: 'ko' }} theme={{ token:{ fontFamily:"SUITE-Regular"}}}>
            <Form.Item
                className={formItemStyles.form_item}
                name={name}
                label={label}
                rules={[{ required: required, message: <span style={{ fontFamily: 'SUITE-Regular' }}>{label} 선택은 필수입니다.</span> }]}
            >
                <RangePicker
                    picker="month"
                    monthCellRender={customMonthRender} // 커스텀 월 렌더링
                    disabledDate={isAnal ? disabledDate : undefined} // 비활성화 날짜 설정
                />
            </Form.Item>
        </ConfigProvider>
    );
}
