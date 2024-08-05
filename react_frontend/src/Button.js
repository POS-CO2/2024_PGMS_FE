import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CachedIcon from '@mui/icons-material/Cached';

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

export default function AddButton() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
        <CustomButton variant="contained">
            등록 <ControlPointIcon className="icon" />
        </CustomButton>
    </div>
  );
}

export function AddAndDeleteButton() {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
          <CustomButton variant="contained">
              삭제 <DeleteForeverIcon className="icon" />
          </CustomButton>
          <CustomButton variant="contained">
              등록 <ControlPointIcon className="icon" />
          </CustomButton>
      </div>
    );
  }

  export function AllButton() {
    return (
      <div style={{ display: 'flex', gap: '8px' }}> {/* 버튼들을 수평으로 배치 */}
        <CustomButton variant="contained">
            수정 <CachedIcon className="icon" />
        </CustomButton>
        <CustomButton variant="contained">
            삭제 <DeleteForeverIcon className="icon" />
        </CustomButton>
        <CustomButton variant="contained">
            등록 <ControlPointIcon className="icon" />
        </CustomButton>
      </div>
    );
  }

