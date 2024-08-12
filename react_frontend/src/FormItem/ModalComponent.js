import React, { useState } from 'react';
import { Modal, Form, Select } from 'antd';

export default function ModalComponent({ title, contents, isModalOpen, handleOk, handleCancel }) {
  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' }
  ];

  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const onSelectChange = (value) => {
    const selectedOption = selectOptions.find(option => option.value === value);
    setSelectedValue(value);
    setSelectedLabel(selectedOption ? selectedOption.label : null); // 선택된 값 설정
  };
  const onOk = () => {
    handleOk({ value: selectedValue, label: selectedLabel }); // 선택된 값 전달
  };

  return (
    <Modal title={title} open={isModalOpen} onOk={onOk} onCancel={handleCancel}>
      {/*{contents}*/}

      <Form layout="vertical">
        <Form.Item label="Option" name="option">
          <Select onChange={onSelectChange}>
            {selectOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
