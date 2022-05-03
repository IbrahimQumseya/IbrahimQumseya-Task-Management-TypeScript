import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';

import { TablePagination } from '@mui/material';
import { RootState } from '../app/store';
import { fetchAllTasks } from '../api/tasksAPI';
import { selectTasks, taskMetadataInterface, UserInterface } from '../features/tasks/tasksSlice';

function RowComponent(props: any) {
  const dispatch = useDispatch();
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          {row.title}
        </TableCell>
        <TableCell align='center'>{row.description}</TableCell>
        <TableCell align='center'>{row.status}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export type TasksInterface = Array<{
  id: string;
  title: string;
  description: string;
  user: UserInterface;
  taskMetadata: taskMetadataInterface;
}>;

function TasksTable() {
  const tasks: TasksInterface = useSelector(selectTasks);
  const status = useSelector((state: RootState) => state.tasks.status);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const userIsAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (userIsAuthenticated) {
      dispatch(fetchAllTasks());
    }
  }, [dispatch, userIsAuthenticated]);

  return (
    <TableContainer component={Paper}>
      {status === 'loading' ? (
        <></>
      ) : (
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='center'>title</TableCell>
              <TableCell align='center'>description</TableCell>
              <TableCell align='center'>status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => {
              return <RowComponent key={index} row={value} />;
            })}
          </TableBody>
        </Table>
      )}
      <TablePagination
        component='div'
        rowsPerPageOptions={[5, 10, 20]}
        count={tasks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default TasksTable;
