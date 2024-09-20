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
  DoubleClickEdit: DoubleClickEditButton,
  UploadExcel: UploadExcelButton,
  DownloadExcelForm: DownloadExcelFormButton,
  DownloadExcel: DownloadExcelButton,
  ShowDetails: ShowDetailsButton,
};

export const CustomButton = styled(Button)(({disabled}) => ({
  fontFamily: 'SUITE-Regular',
  fontSize: '1rem',
  fontWeight: 900,
  marginLeft: '3px',
  backgroundColor: disabled ? 'transparent' : 'transparent',
  color: disabled ? '#B6B6B6' : '#0EAA00',
  border: 'none',
  boxShadow: 'none',
  padding: '0px 6px',
  display: 'flex',
  alignItems: 'center',            // 텍스트와 아이콘을 세로 중앙 정렬
  justifyContent: 'center',        // 텍스트와 아이콘을 가로 중앙 정렬
  lineHeight: 'normal',            // 텍스트 줄 높이를 기본값으로 설정
  minWidth: 0,

  '&:hover': {
    backgroundColor: 'transparent',
    color: '#8AC784',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    backgroundColor: 'transparent', // disabled일 때 배경 투명
    color: '#B6B6B6', // disabled일 때 텍스트 색상 유지
  },
  '& .icon': {
    fontSize: '20px',
    color: disabled ? '#B6B6B6' : 'inherit',                 // 아이콘 색도 동일하게 적용
  },
}));

export function AddButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <ControlPointIcon className="icon" />등록
    </CustomButton>
  );
}

export function DeleteButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <DeleteForeverIcon className="icon" />삭제
    </CustomButton>
  );
}

export function EditButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <CachedIcon className="icon" />수정
    </CustomButton>
  );
}

export function DoubleClickEditButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <SaveOutlinedIcon className="icon" />저장
    </CustomButton>
  );
}

export function UploadExcelButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <UploadIcon className="icon" /> 엑셀 업로드 
    </CustomButton>
  );
}

export function DownloadExcelFormButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <DownloadIcon className="icon" /> 엑셀 양식 다운로드 
    </CustomButton>
  );
}

export function DownloadExcelButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      <DownloadIcon className="icon" /> 엑셀 다운로드
    </CustomButton>
  );
}

export function ShowDetailsButton({ onClick, disabled=true }) {
  return (
    <CustomButton variant="contained" onClick={onClick} disabled={disabled}>
      상세보기
    </CustomButton>
  );
}

export function ButtonGroup({ buttons = [], onClicks = [], buttonStatus = [] }) {
  return (
    <div style={{ display: 'flex' }}>
      {buttons.map((button, index) => {
        const ButtonComponent = buttonMap[button];
        const onClick = onClicks[index];
        const isEnabled = buttonStatus[index];
        const disabled = !isEnabled;

        return ButtonComponent ? (
          <ButtonComponent key={button} onClick={onClick} disabled={disabled} />
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