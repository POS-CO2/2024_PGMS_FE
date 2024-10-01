import React, { useState, useEffect } from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function InputYear({ name, label, required=false, defaultSelected=false }) {
	const currentYear = new Date().getFullYear();
	const [yearNum, setYearNum] = useState(currentYear);

	const handleChange = (e) => {
		const inputYearNum = e.target.value;
		// 숫자와 빈 문자열만 허용
		const reg = /^[0-9]*$/;
		if (reg.test(inputYearNum)) {
			setYearNum(inputYearNum);
		}
	};
/*
	// '.' at the end or only '-' in the input box.
	const handleBlur = () => {
		let formattedValue = yearNum.replace(/^0+/, ''); // 선행 0 제거
		if (formattedValue === '') {
			formattedValue = '0'; // 빈 문자열일 경우 '0'으로 설정
		}
		setYearNum(formattedValue);
	};
*/
	return (
		<Form.Item
			className={formItemStyles.form_item}
			name={name}
			label={label}
			rules={[{ required: required, message: <span style={{ fontFamily: 'SUITE-Regular' }}>{label} 입력은 필수입니다.</span> }]}
			initialValue={defaultSelected ? new Date().getFullYear() : undefined}
		>
			<Input
				type='number'
				min="0"
				max="9999"
				//className={formItemStyles.inputNumber}
				style={{ width: 120 }}
				value={yearNum}
				//maxLength={4}
				onChange={handleChange}
				//onBlur={handleBlur}
				//allowClear={{ clearIcon: <CloseOutlined style={{ color: "red" }} /> }}
			/>
		</Form.Item>
	);
};
