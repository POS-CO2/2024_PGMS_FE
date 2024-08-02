import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F4F2FF',
    color: '#6E6893',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FFFFFF',
    color: '#25213B'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables({data}) {
  return (
    <Box sx={{ 
        width: '100%', 
        overflowX: 'auto',
        padding: '0 20px',
        boxSizing: 'border-box'
        }}>
        <TableContainer component={Paper} sx={{ 
                width: 'calc(100% - 10px)', // Box의 패딩을 제외한 너비
                margin: '0 auto' // 가운데 정렬
            }}>
        <Table sx={{ minWidth: 600 }} aria-label="customized table">
            <TableHead>
            <TableRow>
            {
                Object.keys(data[0])?.map(col => <StyledTableCell key={col}>{col}</StyledTableCell>)
            }
            </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row, index) => (
                        <StyledTableRow key={index}>
                            {Object.values(row).map((value, idx) => (
                                <StyledTableCell key={idx} align="left">
                                    {value}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
            </TableBody>
        </Table>
        </TableContainer>
    </Box>
  );
}