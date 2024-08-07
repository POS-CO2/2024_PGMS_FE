import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CachedIcon from '@mui/icons-material/Cached';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';

const buttonMap = {
  Add: AddButton,
  Delete: DeleteButton,
  Edit: EditButton,
  UploadExcel: UploadExcelButton,
  DownloadExcelForm: DownloadExcelFormButton,
  DownloadExcel: DownloadExcelButton
};

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  marginLeft: '3px',
  backgroundColor: '#9284DC',
  color: '#fff',
  borderRadius: '8px',
  padding: '3px 12px',
  gap: '3px',                     // 아이콘과 텍스트 사이의 간격
  '&:hover': {
    backgroundColor: '#9284DC',
  },
  // 아이콘과 텍스트 사이 여백 조절
  '& .icon': {
    fontSize: '20px',
  },
}));

function AddButton() {
  return (
    <CustomButton variant="contained">
      등록 <ControlPointIcon className="icon" />
    </CustomButton>
  );
}

function DeleteButton() {
  return (
    <CustomButton variant="contained">
      삭제 <DeleteForeverIcon className="icon" />
    </CustomButton>
  );
}

function EditButton() {
  return (
    <CustomButton variant="contained">
      수정 <CachedIcon className="icon" />
    </CustomButton>
  );
}

function UploadExcelButton() {
  return (
    <CustomButton variant="contained">
      엑셀 업로드 <UploadIcon className="icon" />
    </CustomButton>
  );
}

function DownloadExcelFormButton() {
  return (
    <CustomButton variant="contained">
      엑셀 양식 다운로드 <DownloadIcon className="icon" />
    </CustomButton>
  );
}

function DownloadExcelButton() {
  return (
    <CustomButton variant="contained">
      엑셀 다운로드 <DownloadIcon className="icon" />
    </CustomButton>
  );
}

export function ButtonGroup({ buttons = [] }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginRight: '23px' }}>
      {buttons.map(button => {
        const ButtonComponent = buttonMap[button];
        return ButtonComponent ? <ButtonComponent key={button} /> : null;
      })}
    </div>
  );
}