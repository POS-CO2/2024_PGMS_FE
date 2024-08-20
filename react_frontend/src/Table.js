import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Checkbox, TablePagination, TextField } from '@mui/material';
import { ConstructionOutlined } from '@mui/icons-material';

// TableCell을 스타일링하는 컴포넌트
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(237,245,254)',
    color: 'rgb(47, 107, 208)',
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
        backgroundColor: 'rgba(133, 187, 249, 0.4)', // 호버 시 배경색 설정
    },
    '&.Mui-selected': {
        backgroundColor: selected && variant === 'default' ? 'rgba(63, 118, 247, 0.5) !important' : '#FFFFFF', // 선택된 상태에서 배경색 강제 적용 (default variant만)
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


export default function CustomizedTables({
        data = [], 
        variant = 'default', 
        onRowClick = () => { }, 
        handleDoubleClick = () => { },
        handleInputChange = () => { }, 
        handleBlur = () => { },
        editingCell = {}
    }) {
    const [selectedRow, setSelectedRow] = useState({});       // default variant의 선택 상태
    const [selectedRows, setSelectedRows] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);             // default page row length
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRowClick = (index) => {
        if(variant === 'default') {
            const newSelectedRow = index === selectedRow ? null : index;
            setSelectedRow(newSelectedRow); // 같은 행 클릭 시 선택 해제
            onRowClick(data[newSelectedRow]);
        }
        if(variant === 'checkbox') {
            const addRow = (selectedRows) =>
                selectedRows.includes(index)                                // prevSelectedRows 배열에 index가 포함되어 있는지 확인
                    ? selectedRows.filter(rowIndex => rowIndex !== index)   // 행이 이미 선택된 경우 배열에서 index 제거
                    : [...selectedRows, index]                              // 행이 선택되지 않은 경우 prevSelectedRows 배열의 복사본을 만들고 그 배열에 index값을 추가
            

            const newSelectedRows = addRow(selectedRows)
            setSelectedRows(newSelectedRows);                        // 행이 선택되지 않은 경우 prevSelectedRows 배열의 복사본을 만들고 그 배열에 index값을 추가
            onRowClick(newSelectedRows.map(i => data[i]));
        }
    };

    const handleCheckboxClick = (e, index) => {
        e.stopPropagation();  // Checkbox 클릭 시 Row 클릭 이벤트가 발생하지 않도록 함
        handleRowClick(index);
    };

    if (!data.length) {
        // 데이터가 비어 있을 경우 처리
        return <p>No data available</p>;
    }

    // `id` 컬럼을 제외한 데이터 필터링
    const filteredData = data.map(row => {
        const { id, ...rest } = row; // `id` 컬럼 제외
        return rest;
    });
    
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ 
            width: '100%', 
            overflowX: 'auto',
            padding: '0 20px',
            boxSizing: 'border-box',
            margin: '0 auto 2rem'
        }}>
            <TableContainer component={Paper} sx={{ 
                    width: 'calc(100% - 10px)',
                    margin: '0 auto',
                    maxHeight: '100%'
            }}>
                <Table sx={{ minWidth: 600 }} stickyHeader aria-label="customized table">
                    <TableHead>
                        <TableRow>
                        {variant === 'checkbox' && <StyledTableCell></StyledTableCell>}
                        {Object.keys(data[0] || {}).filter(col => col !== 'id').map(col => (
                            <StyledTableCell key={col}>{col}</StyledTableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {
                                // 표에 data 채우기
                                paginatedData.map((row, rowIndex) => (
                                    <StyledTableRow 
                                        key={rowIndex + (rowsPerPage * page)}
                                        selected={variant === 'checkbox' 
                                                ? selectedRows.includes(rowIndex) 
                                                : selectedRow === rowIndex + (rowsPerPage * page)}
                                        variant={variant}
                                        onClick={() => handleRowClick(rowIndex + (rowsPerPage * page))}
                                    >
                                        {   // checkbox가 있는 테이블이면 체크박스 셀 추가
                                            variant === 'checkbox' && (
                                                <StyledTableCell>
                                                    <StyledCheckbox 
                                                        checked={selectedRows.includes(rowIndex)}
                                                        onClick={(e) => handleCheckboxClick(e, rowIndex)}
                                                    />
                                                </StyledTableCell>
                                            )
                                        }

                                        {   // 데이터 값 채우기
                                            Object.values(row).map((value, colIndex) => (
                                                <StyledTableCell 
                                                    key={colIndex} 
                                                    align="left"
                                                    onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
                                                >
                                                    {editingCell.row === rowIndex && editingCell.col === colIndex ? (
                                                    <TextField
                                                        value={value}
                                                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        size="small"
                                                    />
                                                ) : (
                                                    value
                                                )}
                                                </StyledTableCell>
                                            ))
                                        }
                                    </StyledTableRow>
                                ))
                            }
                        </TableBody>
                </Table>
            </TableContainer>
            <TablePagination 
                rowsPerPageOptions={[10, 25, 100]} // page row length custom
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}