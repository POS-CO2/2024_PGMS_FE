import React from 'react';
import { styled } from '@mui/material/styles';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const CustomSelect = styled(Select)`
    .ant-select-selector {
        background-color: transparent !important;
        border: 2px solid #transparent !important;
        transition: border-color 0.3s;

        &:hover {
            border-color: #0EAA00 !important;
            border-width: 2px !important;
        }

        &:focus, &:focus-within {
            outline: none;
            border-width: 2px !important;
            border-color: #0EAA00 !important;
            box-shadow: none !important;
        }
    }

    .ant-select-selection-item {
        &:hover {
            border-color: #0EAA00 !important;
        }
    }
`;


export default function DropDown({ name, label, required=false, options, defaultSelected=false, disabled=false, placeholder="", onProjectSelect=()=>{} }) {
    // 옵션 중 가장 긴 옵션의 길이를 계산
    const longestOptionLength = Math.max(...options.map(option => option.label.length));
    // 폰트 사이즈와 기타 요소들을 고려하여 너비를 설정
    const calculatedWidth = `${longestOptionLength * 1.25}rem`; // 기본 폰트 사이즈가 12px이라 가정하고 0.75rem 정도로 설정 -> 전부 짤려서 1.25배로 늘림

    // name이 searchProject인 경우에는 max-width가 70rem 이도록 설정
    const dropdownStyle = {
        width: calculatedWidth,
        minWidth: '8rem',
        maxWidth: name === 'searchProject' ? '70rem' : '16rem'
    };

    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required, message: '${label} 선택은 필수입니다.' }]}
            initialValue={defaultSelected ? options[0].value : undefined}
        >
            <CustomSelect
                /*className={formItemStyles.select_dropdown}*/
                style={dropdownStyle}
                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                disabled={disabled}
                placeholder={placeholder}
                {...(name !== 'actvYear' && { onChange: (value) => onProjectSelect(value) })}  // name이 'actvYear'가 아닐 때만 onChange 속성 추가
            >
                {options.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </CustomSelect>
        </Form.Item>
    )
}