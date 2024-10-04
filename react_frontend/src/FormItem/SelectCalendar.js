import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, DatePicker, ConfigProvider } from 'antd';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CustomRangePicker = styled(RangePicker)({
    // 기본 상태의 스타일
    '&.ant-picker': {
        borderWidth: '1px',
        borderColor: '#d9d9d9',
    },
    // 호버 상태일 때
    '&.ant-picker:hover': {
        outline: 'none',
        boxShadow: '0 0 0 0.5px #0EAA00 !important',
        borderColor: '#0EAA00',
    },
    // 선택된 상태일 때
    '&.ant-picker-focused, &.ant-picker-cell-selected, &.ant-picker-cell-range-start, &.ant-picker-cell-range-end': {
        borderWidth: '2px',
        borderColor: '#0EAA00',
    },
});

export default function SelectCalendar({ name, label, required=false, isAnal=false }) {

    const customMonthRender = (current, info) => {
        if (info.type === 'month') {
            return (
                <div className="ant-picker-cell-inner">
                    {dayjs(current).format('M')}월
                </div>
            );
        }
        return info.originNode; // 기본 렌더링
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
                <ConfigProvider
                    theme={{
                        components:{
                            DatePicker:{
                                activeBorderColor:"#0EAA00",
                                cellActiveWithRangeBg : "#c3e59e",
                                cellRangeBorderColor:"#0EAA00",
                                hoverBorderColor:"#0EAA00",
                                multipleItemBg:"#0EAA00",
                                addonBg:"#0EAA00",
                                multipleItemBorderColor:"#0EAA00"
                            },
                        },
                        token:{
                            colorPrimary: "#0EAA00",
                            fontFamily:"SUITE-Regular",
                        }
                }}>
                    <CustomRangePicker
                        picker="month"
                        cellRender={customMonthRender} // 커스텀 월 렌더링
                    />
                </ConfigProvider>
            </Form.Item>
        </ConfigProvider>
    );
}
