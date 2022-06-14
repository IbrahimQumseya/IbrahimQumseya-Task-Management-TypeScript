import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { ChangeEvent, FormEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateTask } from '../api/tasksAPI';
import { RootState } from '../app/store';
import SelectUser from './SelectUser.component';

export interface CreateTaskInterface {
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  title: string;
  description: string;
  userId: string;
}
function AddTaskToTable() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.users.userId);
  const [state, setState] = useState<CreateTaskInterface>({
    title: '',
    description: '',
    status: 'OPEN',
    userId: userId,
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (state) {
      dispatch(fetchCreateTask({ ...state, userId: userId }));
    }
  };
  return (
    <Box
      sx={{
        marginTop: 8,
        // p:20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
      </Avatar> */}
      <Typography component='h1' variant='h5'>
        Create A task
      </Typography>
      <Box sx={{ m1: 3 }} component='form' noValidate onSubmit={handleSubmit}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='title'
          label='Title'
          name='title'
          value={state.title}
          autoComplete='title'
          onChange={handleOnChange}
          autoFocus
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='description'
          label='Description'
          name='description'
          value={state.description}
          autoComplete='description'
          onChange={handleOnChange}
        />
        <SelectUser />
        <Button type='submit' variant='contained' sx={{ mt: 3 }}>
          Add a task
        </Button>
      </Box>
    </Box>
  );
}

export default AddTaskToTable;
