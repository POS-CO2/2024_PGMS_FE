import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button)(({ theme }) => ({

    marginRight: '22px', // 오른쪽에 16px 여백 추가
    backgroundColor: '#9284DC',
    color: '#fff',
    borderRadius: '8px',
    padding: '8px 16px',
    '&:hover': {
    backgroundColor: '#9284DC',
    },
}));

export default function StyledButton() {
  return (
    <CustomButton 
        variant="contained">등록
    </CustomButton>
  );
}