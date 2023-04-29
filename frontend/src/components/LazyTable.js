import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

import axios from "axios";

export default function LazyTable({ route, columns, defaultPageSize, rowsPerPageOptions }) {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1); // 1 indexed
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);


  useEffect(() => {
    axios.get(`${route}?page=${page}&page_size=${pageSize}`)
      .then(res => setData(res.data));
  }, [route, page, pageSize]);

  const handleChangePage = (e, newPage) => {
    if (newPage < page || data.length === pageSize) {
      setPage(newPage + 1);
    }
  }

  const handleChangePageSize = (e) => {

    const newPageSize = e.target.value;

    if(newPageSize > 0){
      setPageSize(newPageSize);
      setPage(1);
    }
  }

  const defaultRenderCell = (col, row) => {
    return <div>{row[col.field]}</div>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col.headerName}>{col.headerName}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) =>
            <TableRow key={idx}>
              {
                columns.map((col) =>
                    <TableCell key={col.headerName}>
                      {/* Note the following ternary statement renders the cell using a custom renderCell function if defined, or defaultRenderCell otherwise */}
                      {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
                    </TableCell>
                )
              }
            </TableRow>
          )}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
          count={-1}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
      </Table>
    </TableContainer>
  )
}
