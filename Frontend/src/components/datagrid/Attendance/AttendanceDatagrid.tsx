import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
import type { DataGridProps } from '@mui/x-data-grid';
import Link from 'next/link';
import React from 'react';

import type {
  Data as AttendanceType,
  Data,
  Order,
} from '@/components/datagrid/Attendance/consts';
import {
  createData,
  getComparator,
  stableSort,
} from '@/components/datagrid/Attendance/consts';
import EnhancedTableHead from '@/components/datagrid/Attendance/EnhancedTableHead';
import EnhancedTableToolbar from '@/components/datagrid/Attendance/EnhancedTableToolbar';

const AttendanceDatagrid: React.FC<DataGridProps> = ({ rows }) => {
  const tableRows: AttendanceType[] = [];
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('attendanceId');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  rows.map((row) =>
    tableRows.push(
      createData(
        row.serialNumber,
        row.userId,
        row.attendanceId,
        row.status,
        row.attDate,
        row.attTime
      )
    )
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // const newSelected = rows.map((n) => n.id);
      // setSelected(newSelected);
      setSelected(tableRows.map((n) => n.serialNumber));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: number) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, +name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: number) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableRows.length) : 0;

  return (
    <div className='h-72 w-full'>
      <Box>
        <Paper>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer
            sx={{
              maxHeight: 300,
            }}
          >
            <Table
              sx={{ minWidth: 750 }}
              stickyHeader
              aria-labelledby='tableTitle'
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={tableRows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(tableRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.serialNumber);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) =>
                          handleClick(event, row.serialNumber)
                        }
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.serialNumber}
                        selected={isItemSelected}
                        className='cursor-pointer transition duration-300 ease-in-out hover:h-16 hover:bg-gray-100 '
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          align='right'
                          padding='none'
                        >
                          {row.serialNumber}
                        </TableCell>
                        <TableCell
                          component='th'
                          scope='row'
                          padding='none'
                          align='right'
                          className='hover:text-blue-700 hover:underline'
                        >
                          <Link href={`/attendances/attendance/${row.userId}`}>
                            {row.userId}
                          </Link>
                        </TableCell>
                        <TableCell align='right'>{row.attendanceId}</TableCell>
                        <TableCell>{row.attDate}</TableCell>
                        <TableCell>{row.attTime}</TableCell>
                        <TableCell
                          sx={
                            row.status === 'PRESENT'
                              ? {
                                  backgroundColor: '#bee9cd',
                                }
                              : row.status === 'ABSENT'
                              ? {
                                  backgroundColor: '#fd6d6d',
                                }
                              : {
                                  backgroundColor: 'yellow',
                                }
                          }
                        >
                          {row.status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 38 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
            component='div'
            count={tableRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label='Dense padding'
        />
      </Box>
    </div>
  );
};

export default AttendanceDatagrid;
