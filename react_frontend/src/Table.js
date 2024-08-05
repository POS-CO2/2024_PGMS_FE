import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Checkbox } from '@mui/material';

// TableCell을 스타일링하는 컴포넌트
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F4F2FF',
    color: '#6E6893',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// TableRow를 스타일링하는 컴포넌트
const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#E4DCFF', // 호버 시 배경색 설정
    },
    '&.Mui-selected': {
        backgroundColor: '#B7AAFF !important', // 선택된 상태에서 배경색 강제 적용
    },
}));

export default function CustomizedTables({data, variant = 'default'}) {
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleRowClick = (index) => {
        setSelectedRow(index);
      };
    console.log(variant);
    

    return (
        <Box sx={{ 
            width: '100%', 
            overflowX: 'auto',
            padding: '0 20px',
            boxSizing: 'border-box'
            }}>
            <TableContainer component={Paper} sx={{ 
                    width: 'calc(100% - 10px)',
                    margin: '0 auto'
                }}>
            <Table sx={{ minWidth: 600 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {
                            // checkbox가 있는 테이블이면 체크박스 셀 추가
                            variant === 'checkbox' && <StyledTableCell></StyledTableCell> } 
                        {
                            // 컬럼 제목 설정
                            Object.keys(data[0])?.map(col => (<StyledTableCell key={col}>{col}</StyledTableCell>
                            ))    
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        // 표에 data 채우기
                        data.map((row, index) => (
                            <StyledTableRow 
                                key={index}
                                selected={selectedRow === index}
                                onClick={() => handleRowClick(index)}
                            >
                                {   // checkbox가 있는 테이블이면 체크박스 셀 추가
                                    variant === 'checkbox' && (
                                        <StyledTableCell>
                                            <Checkbox />
                                        </StyledTableCell>
                                    )
                                }
                                {   // 데이터 값 채우기
                                    Object.values(row).map((value, idx) => (
                                        <StyledTableCell key={idx} align="left">
                                            {value}
                                        </StyledTableCell>
                                    ))
                                }
                            </StyledTableRow>
                        ))
                    }
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    );
}