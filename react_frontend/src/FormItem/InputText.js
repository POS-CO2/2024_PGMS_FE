import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const CustomInput = styled(({ isChanged, ...rest }) => <Input {...rest} />)`
    background-color: ${({ isChanged }) => (isChanged ? '#FFF5E5' : 'transparent')} !important;

    &:focus, &:hover, &.ant-input-focused, &:focus-within {
        outline: none;
        box-shadow: 0 0 0 0.5px #0EAA00 !important;
        border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }

    input {
        &:focus {
            box-shadow: none !important;
            border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }

`;

export default function InputText({ name, label, required = false, isChanged = false }) {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required, message: <span style={{ fontFamily: 'SUITE-Regular' }}>{label} 입력은 필수입니다.</span> }]}
        >
            <CustomInput
                value={value}
                onChange={handleChange}
                isChanged={isChanged}
                allowClear={{ clearIcon: <CloseOutlined style={{ color: "red" }} /> }}
            />
        </Form.Item>
    )
}