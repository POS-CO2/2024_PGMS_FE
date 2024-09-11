import React, { useState } from 'react';
import { Radio } from 'antd';
import styled from 'styled-components';

const LanguageOptions = [
    {
        label: 'KR',
        value: 'Korean',
    },
    {
        label: 'EN',
        value: 'English',
    },
];

const CustomRadioGroup = styled(Radio.Group)`
    .ant-radio-button-wrapper:hover {
        background-color: #FFFFFF;
        color: #0EAA00;
        border-color: #0EAA00;
    }
    
    .ant-radio-button-wrapper {
        font-family: SUITE-Regular;
    }

    .ant-radio-button-wrapper:not(:first-child)::before {
        background-color: #0EAA00; /* Line between buttons */
    }

    .ant-radio-button-wrapper-checked {
        background-color: #0EAA00 !important;
        color: white;
        border-color: #0EAA00 !important;
    }

    .ant-radio-button-wrapper-checked:hover {
        background-color: #FFFFFF;
        color: white;
        border-color: #0EAA00 !important;
    }
`;

export default function Language() {
    const [language, setLanguage] = useState('Korean');

    const onLangChange = ({ target: { value } }) => {
        setLanguage(value);
    };

    return (
        <CustomRadioGroup
            options={LanguageOptions}
            onChange={onLangChange}
            value={language}
            optionType="button"
            buttonStyle="solid"
        />
    );
}