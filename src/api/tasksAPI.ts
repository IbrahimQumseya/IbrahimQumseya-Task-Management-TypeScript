import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { CreateTaskInterface } from '../components/AddTaskToTable';
import instance from './instanceAPI';

export const fetchAllTasks = createAsyncThunk('tasks/getTasks', async (_token, _thunkAPI) => {
  try {
    const res = await instance.get('/tasks');
    return res.data;
  } catch (error: any) {
    throw Error(error);
  }
});

export const fetchCreateTask = createAsyncThunk('tasks/createTask', async (body: CreateTaskInterface) => {
  try {
    const res = await instance.post('/tasks', body);
    return res.data;
  } catch (error: any) {
    throw Error(error);
  }
});
