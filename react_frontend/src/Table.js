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
import InboxIcon from '@mui/icons-material/Inbox';
import Typography from '@mui/material/Typography';

// TableCell을 스타일링하는 컴포넌트
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0A7800',
    color: '#FFFFFF',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap', // 텍스트를 한 줄로 유지
    overflow: 'hidden', // 넘치는 내용을 숨기기
    textOverflow: 'ellipsis', // 넘치는 텍스트를 ...로 표시
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.75rem',
    whiteSpace: 'nowrap', // 텍스트를 한 줄로 유지
    overflow: 'hidden', // 넘치는 내용을 숨기기
    textOverflow: 'ellipsis', // 넘치는 텍스트를 ...로 표시
  },
}));

// TableRow를 스타일링하는 컴포넌트
const StyledTableRow = styled(TableRow)(({ theme, selected, variant, edited }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#E5F1E4', // 호버 시 배경색 설정
    },
    '&.Mui-selected': {
        backgroundColor: selected && variant === 'default' ? '#B7E4B3 !important' : '#FFFFFF', // 선택된 상태에서 배경색 강제 적용 (default variant만)
    },

    backgroundColor: edited ? '#FFF5E5' : 'transparent', // 수정된 행일 경우 배경색 변경
}));

// Checkbox를 스타일링하는 컴포넌트
const StyledCheckbox = styled(Checkbox)(({ theme, checked }) => ({
    '& .MuiSvgIcon-root': {
      color: '#0EAA00',
    },
    '&.Mui-checked .MuiSvgIcon-root': {
      color: '#0EAA00', // 체크된 상태 배경색
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
        editingCell = {},
        pagination = true,
        modalPagination = false,
        columns = [],
        editedRows= []
    }) {
    const [selectedRow, setSelectedRow] = useState({});       // default variant의 선택 상태
    const [selectedRows, setSelectedRows] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(modalPagination ? 5 : 13);             // default page row length
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
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                textAlign: 'center', 
                padding: '2rem' 
            }}>
                <InboxIcon sx={{ fontSize: 60, color: 'gray' }} />
                <br/>
                <Typography variant="body2" color="textSecondary" paragraph>
                    데이터를 찾을 수 없습니다. 데이터를 다시 불러오거나, 다른 옵션을 시도해보세요.
                </Typography>
            </Box>
        );
    }

    // `id` 컬럼을 제외한 데이터 필터링
    // const filteredData = data.map(row => {
    //     const { id, ...rest } = row; // `id` 컬럼 제외
    //     return rest;
    // });

    const visibleColumns = columns.filter(col => !col.hidden);

    const filteredData = data.map(row => {
        let filteredRow = {};
        visibleColumns.forEach(col => {
            filteredRow[col.key] = row[col.key];
        });
        return filteredRow;
    });
    
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ 
            overflowX: 'auto',
            boxSizing: 'border-box',
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
                        {visibleColumns.map(col => (
                            <StyledTableCell key={col.key}>{col.label}</StyledTableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {pagination ? (
                                // 표에 data 채우기
                                paginatedData.map((row, rowIndex) => (
                                    <StyledTableRow 
                                        key={rowIndex + (rowsPerPage * page)}
                                        selected={variant === 'checkbox' 
                                                ? selectedRows.includes(rowIndex) 
                                                : selectedRow === rowIndex + (rowsPerPage * page)}
                                        variant={variant}
                                        edited={editedRows.includes(rowIndex + (rowsPerPage * page))} // 수정된 행을 식별
                                        onClick={() => handleRowClick(rowIndex + (rowsPerPage * page))}
                                    >
                                        {   // checkbox가 있는 테이블이면 체크박스 셀 추가
                                            variant === 'checkbox' && (
                                                <StyledTableCell>
                                                    <StyledCheckbox 
                                                        checked={selectedRows.includes(rowIndex + (rowsPerPage * page))}
                                                        onClick={(e) => handleCheckboxClick(e, rowIndex + (rowsPerPage * page))}
                                                    />
                                                </StyledTableCell>
                                            )
                                        }

                                        {   // 데이터 값 채우기
                                            visibleColumns.map((col, colIndex) => (
                                                <StyledTableCell 
                                                    key={colIndex} 
                                                    align="left"
                                                    onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
                                                >
                                                    {editingCell.row === rowIndex && editingCell.col === colIndex ? (
                                                    <TextField
                                                        value={row[col.key]}
                                                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        size="small"
                                                    />
                                                ) : (
                                                    row[col.key]
                                                )}
                                                </StyledTableCell>
                                            ))
                                        }
                                    </StyledTableRow>
                                ))) :
                                (
                                    filteredData.map((row, index) => (
                                        <StyledTableRow 
                                            key={index}
                                            selected={
                                                variant === 'checkbox' 
                                                ? selectedRows.includes(index) 
                                                : selectedRow === index
                                            }
                                            edited={editedRows.includes(index)} // 수정된 행을 식별
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
                                                visibleColumns.map((value, idx) => (
                                                    <StyledTableCell key={idx} align="left" onDoubleClick={() => {handleDoubleClick(index, idx)}}>
                                                        {editingCell.row === index && editingCell.col === idx ? (
                                                            <TextField
                                                                value={row[value.key]}
                                                                onChange={(e) => handleInputChange(e, index, idx)}
                                                                onBlur={handleBlur}
                                                                autoFocus
                                                                size="small"
                                                            />
                                                        ) : (
                                                            row[value.key]
                                                        )}
                                                        {/* {value} */}
                                                    </StyledTableCell>
                                                ))
                                            }
                                        </StyledTableRow>
                                    ))
                                )
                            }
                        </TableBody>
                </Table>
            </TableContainer>
            {pagination && (data.length >= 13) ? ( !modalPagination ? (// 10개 이상이면 자동으로 pagination 활성화, (pagination이 true일때만.)
            <TablePagination 
                rowsPerPageOptions={[13, 25, 100]} // page row length custom
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            ) : (
                <TablePagination 
                rowsPerPageOptions={[5, 10, 25]} // page row length custom
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            )
            ) : ( !modalPagination ? (
                <></>
            ) : (
                <TablePagination 
                rowsPerPageOptions={[5, 10, 25]} // page row length custom
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            )
            )
            }
        </Box>
    );
}