import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function SelectCalendar({ name, label, required = false }) {

    const customMonthRender = (current) => {
        return (
            <div className="ant-picker-cell-inner">
                {dayjs(current).format('M')}월
            </div>
        );
    };

    return (
        <ConfigProvider locale={{ locale: 'ko' }} theme={{ token:{ fontFamily:"SUITE-Regular"}}}>
            <Form.Item
                className={formItemStyles.form_item}
                name={name}
                label={label}
                rules={[{ required: required, message: '${label} 선택은 필수입니다.' }]}
            >
                <RangePicker
                    picker="month"
                    monthCellRender={customMonthRender} // 커스텀 월 렌더링
                />
            </Form.Item>
        </ConfigProvider>
    );
}
