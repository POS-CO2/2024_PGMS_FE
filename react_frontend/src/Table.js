import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { pjtManagerColumns } from './assets/json/tableColumn';
import { Box, Checkbox, TablePagination, TextField, Card, CardContent, Typography, CardMedia  } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

// TableCell을 스타일링하는 컴포넌트
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    position: "relative",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0A7800',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    fontFamily: 'SUITE-Regular',
    overflow: 'hidden',
    whiteSpace: 'nowrap', // 텍스트를 한 줄로 유지
    textOverflow: 'ellipsis', // 넘치는 텍스트를 ...로 표시
    minWidth: '5px', // min-width를 최소로 설정
    width: 'auto', // 자동 크기 조정
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.9rem',
    fontFamily: 'SUITE-Regular',
    overflow: 'hidden',
    whiteSpace: 'nowrap', // 텍스트를 한 줄로 유지
    textOverflow: 'ellipsis', // 넘치는 텍스트를 ...로 표시
    minWidth: '5px', // 최소 크기를 없앰
    width: 'auto', // 자동 크기 조정
    maxWidth: 'none',
  },
  '&:not(:last-child)::after': {
    content: '""',
    position: 'absolute',
    top: '25%', // 위에서부터 시작할 위치 (전체 높이의 25%)
    bottom: '25%', // 아래에서 끝날 위치 (전체 높이의 25%)
    right: 0,
    width: '0.08rem',
    backgroundColor: '#FFF',
  },
  "& .resize-handle": {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "0.5rem",
    cursor: "col-resize",
    backgroundColor: "transparent",
    zIndex: 1,
  },
}));

// TableRow를 스타일링하는 컴포넌트
const StyledTableRow = styled(TableRow)(({ theme, selected, variant, edited, submitted }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#E5F1E4', // 호버 시 배경색 설정
    },
    '&.Mui-selected': {
        backgroundColor: selected && variant === 'default' ? '#B7E4B3 !important' : '#FFFFFF', // 선택된 상태에서 배경색 강제 적용 (default variant만)
    },

    backgroundColor: (submitted || edited) ? '#FFF5E5' : 'transparent', // 수정된 행일 경우 배경색 변경
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

// 텍스트 길이에 따라 너비 계산하는 함수
const calculateColumnWidths = (columns, data, fontWidth = 2, hasCheckbox = false) => {
    const widths = {};

    let visibleIndex = 0; // visible 열에 대한 인덱스를 따로 관리

    // 체크박스가 있는 경우 첫 번째 열을 20px로 설정
    if (hasCheckbox) {
        widths[`col-checkbox`] = "4rem"; // 체크박스 열에 고정된 너비 할당
    }
    
    columns.forEach((col, index) => {
        if (col.hidden) return; // hidden 열은 건너뛰기

        // 각 열의 헤더와 데이터 중 가장 긴 텍스트 길이를 찾아서 너비 계산
        let maxTextLength = Math.max(
            col.label.length,
            ...data.map((row) => (row[col.key] ? row[col.key].toString().length : 0))
        );

        // '코드그룹영문명'일 경우 텍스트 길이를 1.5로 나눔(영어랑 한글의 바이트 차이 떄문에)
        if (col.label === '코드그룹영문명') {
            maxTextLength = maxTextLength / 1.5;
        }

        // 최소 너비는 100px, 텍스트 길이에 따른 너비 계산
        widths[`col${visibleIndex}`] = Math.max(100, maxTextLength * fontWidth + 20);
        visibleIndex++; // visible 열에 대한 인덱스를 증가시킴
    });
    
    return widths;
};

export default function CustomizedTables({
        data = [], 
        submittedRowIdx = [],
        selectedRowId = null,
        variant = 'default', 
        onRowClick = () => { }, 
        handleDoubleClick = () => { },
        handleInputChange = () => { }, 
        handleBlur = () => { },
        editingCell = {},
        pagination = true,
        modalPagination = false,
        monthPagination = false,
        columns = [],
        editedRows= [],
        subData = [], // 담당자 목록
        expandedRow, // 확장된 행
    }) {
    const [selectedRow, setSelectedRow] = useState(null);   //variant = 'default' 의 선택상태
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(modalPagination ? 5 : (monthPagination ? 12 : 10));             // default page row length
    const [columnWidths, setColumnWidths] = useState({});
    
    // selectedRowId와 일치하는 행을 찾아 인덱스를 selectedRow로 설정하고 페이지를 이동
    useEffect(() => {
        if (Array.isArray(data) && selectedRowId !== null) {
        const rowIndex = data.findIndex(row => row.id === selectedRowId);
        if (rowIndex !== -1) {
            setSelectedRow(rowIndex);

            // rowIndex에 해당하는 페이지로 이동
            const newPage = Math.floor(rowIndex / rowsPerPage); // 페이지 계산
            setPage(newPage); // 페이지 이동
        }
        }
    }, [selectedRowId, data, rowsPerPage]);

    // 데이터와 컬럼에 기반하여 초기 열 너비 설정
    useEffect(() => {
        if (data.length > 0 && columns.length > 0) {
            const initialWidths = calculateColumnWidths(columns, data, 15, variant === 'checkbox');
            setColumnWidths(initialWidths);
        }
    }, [data, columns]);

    const resizingColumn = useRef(null);
    const startX = useRef(0);
    const initialWidth = useRef(0);
    const imageUrl = 'http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png';
    
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
            onRowClick({row: data[newSelectedRow], rowIndex: index});
        }
        if(variant === 'checkbox') {
            const addRow = (selectedRows) =>
                selectedRows.includes(index)                                // prevSelectedRows 배열에 index가 포함되어 있는지 확인
                    ? selectedRows.filter(rowIndex => rowIndex !== index)   // 행이 이미 선택된 경우 배열에서 index 제거
                    : [...selectedRows, index]                              // 행이 선택되지 않은 경우 prevSelectedRows 배열의 복사본을 만들고 그 배열에 index값을 추가
            

            const newSelectedRows = addRow(selectedRows)
            setSelectedRows(newSelectedRows);                        // 행이 선택되지 않은 경우 prevSelectedRows 배열의 복사본을 만들고 그 배열에 index값을 추가
            onRowClick({row: newSelectedRows.map(i => data[i])});
        }
    };

    const handleCheckboxClick = (e, index) => {
        e.stopPropagation();  // Checkbox 클릭 시 Row 클릭 이벤트가 발생하지 않도록 함
        handleRowClick(index);
    };

    // 마우스 드래그 시작 시 이벤트 처리
    const handleMouseDown = (colKey, e) => {
        resizingColumn.current = colKey;
        startX.current = e.clientX;
        initialWidth.current = columnWidths[colKey];

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // 마우스 이동 시 컬럼 크기 조정
    const handleMouseMove = (e) => {
        if (resizingColumn.current) {
            const newWidth = initialWidth.current + (e.clientX - startX.current);
            const minWidth = 5; // 최소 너비 설정
            const maxWidth = 500; // 최대 너비 설정

            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [resizingColumn.current]: Math.max(minWidth, Math.min(newWidth, maxWidth)), // 최소와 최대 너비 적용
            }));
        }
    };

    // 마우스 드래그가 끝났을 때 이벤트 제거
    const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
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
                width: '100%', // 부모 컨테이너의 너비에 맞춤
                margin: '0 auto',
                overflowX: 'auto', // 가로 스크롤 허용
            }}>
                <Table sx={{ tableLayout: 'fixed' }} stickyHeader aria-label="customized table">
                    <TableHead>
                        <TableRow>
                        {variant === 'checkbox' && (
                            <StyledTableCell style={{ width: columnWidths['col-checkbox'] }}>
                            </StyledTableCell>
                        )}
                        {visibleColumns.map((col, colIndex) => (
                            <StyledTableCell 
                                key={col.key}
                                style={{ 
                                    width: columnWidths[`col${colIndex}`],
                                    minWidth: 5,  // 최소 너비 설정
                                    maxWidth: 'none',  // 최대 너비는 제한하지 않음
                                }}
                            >
                                {col.label}
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => handleMouseDown(`col${colIndex}`, e)}
                                />
                            </StyledTableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {pagination ? (
                                // 표에 data 채우기
                                paginatedData.map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        <StyledTableRow 
                                            key={rowIndex + (rowsPerPage * page)}
                                            submitted={submittedRowIdx.includes(rowIndex + (rowsPerPage * page))}
                                            selected={variant === 'checkbox' 
                                                ? selectedRows.includes(rowIndex) 
                                                : selectedRow === rowIndex + (rowsPerPage * page)}
                                                variant={variant}
                                                edited={editedRows.includes(rowIndex + (rowsPerPage * page))} // 수정된 행을 식별
                                                onClick={() => handleRowClick(rowIndex + (rowsPerPage * page))}
                                                >
                                            {   // checkbox가 있는 테이블이면 체크박스 셀 추가
                                                variant === 'checkbox' && (
                                                    <StyledTableCell style={{ width: columnWidths['col-checkbox'] }}>
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
                                                        style={{ 
                                                            width: columnWidths[`col${colIndex}`],
                                                            minWidth: 5,  // 최소 너비 설정
                                                            maxWidth: 'none',  // 최대 너비는 제한하지 않음
                                                        }}
                                                    >
                                                        {editingCell.row === rowIndex && editingCell.col === colIndex ? (
                                                        <TextField
                                                            value={row[col.key]}
                                                            onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                                                            onBlur={handleBlur}
                                                            autoFocus
                                                            size="small"
                                                            sx={{width:"8rem"}}
                                                        />  
                                                    ) : (
                                                        row[col.key]
                                                    )}
                                                    </StyledTableCell>
                                                ))
                                            }
                                        </StyledTableRow>

                                        {/* 클릭된 프로젝트 행 하단에 담당자 목록을 표시 */}
                                        {expandedRow === rowIndex + (rowsPerPage * page) && (
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={visibleColumns.length}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#FFF',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'flex-start', 
                                                        overflowX: 'auto',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 'bold', 
                                                            marginBottom: '1rem', // 제목과 카드들 사이에 간격 추가 
                                                            borderBottom: '2px solid black', // 밑줄 추가
                                                            display: 'inline-block', 
                                                            width: 'fit-content', // 텍스트 길이에 맞게 너비 설정
                                                        }}
                                                    >
                                                        담당자목록
                                                    </Typography>
                                                    {subData.length > 0 ? (
                                                        <Box
                                                            sx={{
                                                                display: 'inline-flex',
                                                                gap: '2rem', // 카드 간격
                                                                padding: '1rem',
                                                            }}
                                                        >
                                                            {subData.map((manager, mgrIndex) => (
                                                                <Card 
                                                                    key={mgrIndex} 
                                                                    sx={{
                                                                        minWidth: '16rem', // 고정된 카드 최소 너비
                                                                        maxWidth: '16rem', // 고정된 카드 최대 너비
                                                                        flexShrink: 0, // 가로 스크롤 시 크기가 줄어들지 않도록 설정
                                                                        backgroundColor: '#F6FBD6',
                                                                        padding: '1rem',
                                                                        display: 'flex', 
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <CardMedia
                                                                        component="img"
                                                                        sx={{ width: '4rem', height: '4rem', marginRight: '1rem', marginLeft: '1rem' }}  // 이미지 크기 설정
                                                                        image={imageUrl} // 이미지 URL
                                                                        alt={`${manager.userName} 프로필 이미지`}
                                                                    />
                                                                    <Box>
                                                                        <CardContent>
                                                                            {pjtManagerColumns
                                                                                .filter((col) => !col.hidden) // 'hidden: true' 필드를 제외
                                                                                .map((col) => (
                                                                                <Typography key={col.key} variant="body2">
                                                                                    <strong>{col.label}:</strong> {manager[col.key]}
                                                                                </Typography>
                                                                            ))}
                                                                        </CardContent>
                                                                    </Box>
                                                                </Card>
                                                            ))}
                                                        </Box>
                                                        ) : (
                                                            
                                                            // subData가 없을 때 보여줄 메시지
                                                            <Typography 
                                                                variant="body2" 
                                                                color="textSecondary" 
                                                                sx={{ fontSize: '1rem' }}>
                                                                지정된 현장담당자가 없습니다.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                    </React.Fragment>
                                ))) :
                                (
                                    filteredData.map((row, index) => (
                                        <StyledTableRow 
                                            key={index}
                                            submitted={submittedRowIdx.includes(index)}
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
                                                    <StyledTableCell 
                                                        key={idx} 
                                                        align="left" 
                                                        onDoubleClick={() => {handleDoubleClick(index, idx)}}
                                                        style={{ 
                                                            width: columnWidths[`col${idx}`],
                                                            minWidth: 5,  // 최소 너비 설정
                                                            maxWidth: 'none',  // 최대 너비는 제한하지 않음
                                                        }}
                                                    >
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
            {pagination && (data.length >= 10) ? ( !modalPagination ? (// 10개 이상이면 자동으로 pagination 활성화, (pagination이 true일때만.)
            //페이지네이션을 하고 데이터길이가 길며 모달페이지네이션이 아닐때
            <TablePagination 
                rowsPerPageOptions={[10, 25, 100]} // page row length custom
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            ) : (
                //페이지네이션을 하고 데이터길이가 길며 모달페이지네이션이 맞을때
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
                //페이지네이션을 안하거나 데이터길이가 12이하이며 모달페이지네이션일때
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