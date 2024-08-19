import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CachedIcon from '@mui/icons-material/Cached';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const buttonMap = {
  Add: AddButton,
  Delete: DeleteButton,
  Edit: EditButton,
  UploadExcel: UploadExcelButton,
  DownloadExcelForm: DownloadExcelFormButton,
  DownloadExcel: DownloadExcelButton,
  ShowDetails: ShowDetailsButton
};

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  marginLeft: '3px',
  backgroundColor: 'rgb(56, 117, 247)', // #9284dc 원래 색상
  color: '#fff',
  borderRadius: '8px',
  padding: '3px 12px',
  gap: '3px',                     // 아이콘과 텍스트 사이의 간격
  '&:hover': {
    backgroundColor: 'rgb(85, 146, 248)',
  },
  // 아이콘과 텍스트 사이 여백 조절
  '& .icon': {
    fontSize: '20px',
  },
}));

export function AddButton({ onClick }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      등록 <ControlPointIcon className="icon" />
    </CustomButton>
  );
}

export function DeleteButton({ onClick }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      삭제 <DeleteForeverIcon className="icon" />
    </CustomButton>
  );
}

export function EditButton({ onClick, isEditing }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      {isEditing
        ? <>저장 <SaveOutlinedIcon className="icon" /></>
        : <>수정 <CachedIcon className="icon" /></>
      }
    </CustomButton>
  );
}

export function UploadExcelButton({ onClick }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      엑셀 업로드 <UploadIcon className="icon" />
    </CustomButton>
  );
}

export function DownloadExcelFormButton({ onClick }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      엑셀 양식 다운로드 <DownloadIcon className="icon" />
    </CustomButton>
  );
}

export function DownloadExcelButton({ onClick }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      엑셀 다운로드 <DownloadIcon className="icon" />
    </CustomButton>
  );
}

export function ShowDetailsButton({ onClick }) {
  return (
    <CustomButton variant="contained" onClick={onClick}>
      상세보기
    </CustomButton>
  );
}

export function ButtonGroup({ buttons = [], onClicks = [], buttonStatus = [], isEditing = false }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginRight: '23px' }}>
      {buttons.map((button, index) => {
        const ButtonComponent = buttonMap[button];
        const onClick = onClicks[index];
        const isEnabled = buttonStatus[index];

        return ButtonComponent ? (
          isEnabled ? (
            <ButtonComponent key={button} onClick={onClick} isEditing={isEditing} />
          ) : null
        ) : null;
      })}
    </div>
  );
}

export function ButtonGroupMm({ buttons = [], onClick }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginRight: '1rem', justifyContent: "flex-end" }}>
      {buttons.map(button => {
        const ButtonComponent = buttonMap[button];
        return ButtonComponent ? <ButtonComponent key={button} onClick={onClick} /> : null;
      })}
    </div>
  );
}