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
const StyledTableRow = styled(TableRow)(({ theme, selected, variant }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#E4DCFF', // 호버 시 배경색 설정
    },
    '&.Mui-selected': {
        backgroundColor: selected && variant === 'default' ? '#B7AAFF !important' : '#FFFFFF', // 선택된 상태에서 배경색 강제 적용 (default variant만)
    },
}));

// Checkbox를 스타일링하는 컴포넌트
const StyledCheckbox = styled(Checkbox)(({ theme, checked }) => ({
    '& .MuiSvgIcon-root': {
      color: '#8B83BA',
    },
    '&.Mui-checked .MuiSvgIcon-root': {
      color: '#6D5BD0', // 체크된 상태 배경색
    },
    '& .MuiCheckbox-root': {
      backgroundColor: '#FFFFFF', // 체크박스 배경색
    },
}));

export default function CustomizedTables({data, variant = 'default'}) {
    const [selectedRow, setSelectedRow] = React.useState(null); // default variant의 선택 상태
    const [selectedRows, setSelectedRows] = React.useState([]); // checkbox variant의 선택 상태

    const handleRowClick = (index, event) => {
        if (variant === 'default') {
            setSelectedRow(index === selectedRow ? null : index); // 같은 행 클릭 시 선택 해제
        } else if (variant === 'checkbox') {
            // row 클릭시 setSelectedRows에 추가
            if (event.target.type !== 'checkbox') {
                setSelectedRows((prevSelectedRows) =>
                    prevSelectedRows.includes(index)                                // prevSelectedRows 배열에 index가 포함되어 있는지 확인
                        ? prevSelectedRows.filter(rowIndex => rowIndex !== index)   // 행이 이미 선택된 경우 배열에서 index 제거
                        : [...prevSelectedRows, index]                              // 행이 선택되지 않은 경우 prevSelectedRows 배열의 복사본을 만들고 그 배열에 index값을 추가
                );
            }                       
        }
    };

    // checkbox 클릭시 setSelectedRows에 추가
    const handleCheckboxChange = (index) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(index) 
                ? prevSelectedRows.filter(rowIndex => rowIndex !== index)
                : [...prevSelectedRows, index]                         
        );
    }

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
                                selected={
                                    variant === 'checkbox' 
                                    ? selectedRows.includes(index) 
                                    : selectedRow === index
                                }
                                onClick={(e) => handleRowClick(index, e)}
                            >
                                {   // checkbox가 있는 테이블이면 체크박스 셀 추가
                                    variant === 'checkbox' && (
                                        <StyledTableCell>
                                            <StyledCheckbox 
                                                checked={selectedRows.includes(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
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