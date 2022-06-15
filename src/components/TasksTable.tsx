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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';

import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import { RootState } from '../app/store';
import { fetchAllTasksByAdmin, fetchAllTasksByUser, updateTaskStatus } from '../api/tasksAPI';
import { selectTasks, taskMetadataInterface, TasksState, UserInterface } from '../features/tasks/tasksSlice';
import { TaskStatus, UserRoleEnum } from '../interfaces/data.interface';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: TasksInterface[], comparator: (a: TasksInterface, b: TasksInterface) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [TasksInterface, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function RowComponent(props: { row: TasksInterface }) {
  const dispatch = useDispatch();
  const { row } = props;
  const [status, setStatus] = useState<TaskStatus>(row.status ? row.status : TaskStatus.OPEN);
  const [open, setOpen] = useState(false);
  const userRole = useSelector((state: RootState) => state.user.user.role);
  const [detailTask, setDetailTask] = useState<string>(row.taskMetadata.details);
  const [enable, setEnable] = useState<boolean>(true);

  const handleChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setStatus(event.target.value as TaskStatus);
    dispatch(updateTaskStatus({ status: event.target.value as TaskStatus, taskId: row.id }));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          {row.user.username}
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          {row.title}
        </TableCell>
        <TableCell align='center'>{row.description}</TableCell>
        <TableCell
          align='center'
          sx={{
            color:
              row.status === TaskStatus.DONE
                ? 'green'
                : row.status === TaskStatus.IN_PROGRESS
                ? 'gray'
                : row.status === TaskStatus.IN_REVIEW
                ? 'blue'
                : 'black',

            fontWeight: 'bold',
          }}
        >
          {row.status}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Details
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>IsActivated</TableCell>
                    {/* <TableCell>Details</TableCell> */}
                    <TableCell align='center'>status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      {row.taskMetadata.isDeactivated.toString()}
                    </TableCell>
                    {/* <TableCell>{row.taskMetadata.details}</TableCell> */}
                    <TableCell align='center'>
                      <FormControl sx={{ width: '200px' }}>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={status ? status : row.status}
                          // label='Age'
                          onChange={handleChange}
                        >
                          <MenuItem value={'OPEN'}>OPEN</MenuItem>
                          <MenuItem value={'IN_PROGRESS'}>IN_PROGRESS</MenuItem>
                          <MenuItem value={'IN_REVIEW'}>IN_REVIEW</MenuItem>
                          {userRole === UserRoleEnum.ADMIN && <MenuItem value={'DONE'}>DONE</MenuItem>}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export type TasksInterface = {
  id: string;
  title: string;
  description: string;
  user: UserInterface;
  taskMetadata: taskMetadataInterface;
  status?: TaskStatus;
};

function TasksTable() {
  const tasks: Array<TasksInterface> = useSelector(selectTasks);
  const status = useSelector((state: RootState) => state.tasks.status);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const userIsAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.user.user.role);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof TasksInterface>('status');
  const sortedDTasks: TasksInterface[] = [...tasks].sort((a, b) => {
    if (a.status !== undefined && b.status !== undefined && order === 'asc') {
      return a.status > b.status ? -1 : 1;
    }
    if (a.status !== undefined && b.status !== undefined && order === 'desc') {
      return a.status > b.status ? 1 : -1;
    }
    return 0;
  });

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (userIsAuthenticated && userRole === UserRoleEnum.ADMIN) {
      dispatch(fetchAllTasksByAdmin());
    }
  }, [dispatch, userIsAuthenticated, userRole]);

  useEffect(() => {
    if (userIsAuthenticated && userRole !== UserRoleEnum.ADMIN) {
      dispatch(fetchAllTasksByUser());
    }
  }, [dispatch, userIsAuthenticated, userRole]);

  const handleChangeSort = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Container maxWidth='xl' sx={{ pt: 2 }}>
      <TableContainer component={Paper}>
        {status === 'loading' ? (
          <></>
        ) : (
          <Table aria-label='collapsible table'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: 18 }}>
                  Username
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: 18 }}>
                  Room Number
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: 18 }}>
                  description
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: 18 }}>
                  status
                  <IconButton onClick={handleChangeSort}>
                    {order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // stableSort(tasks, getComparator(order, orderBy))
                sortedDTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, index) => {
                  return <RowComponent key={index} row={value} />;
                })
              }
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
    </Container>
  );
}

export default TasksTable;
