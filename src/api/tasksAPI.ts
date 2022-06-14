import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { CreateTaskInterface } from '../components/AddTaskToTable';
import { TaskStatus } from '../interfaces/data.interface';
import instance from './instanceAPI';

export const fetchAllTasksByAdmin = createAsyncThunk('tasks/getTasksByAdmin', async (_token, _thunkAPI) => {
  try {
    const res = await instance.get('/tasks');
    return res.data;
  } catch (error: any) {
    throw Error(error);
  }
});

export const fetchAllTasksByUser = createAsyncThunk('tasks/getTasksByUser', async (_data, _thunkAPI) => {
  try {
    const res = await instance.get(`/tasks/user`);
    return res.data;
  } catch (error: any) {
    throw Error(error);
  }
});

export const fetchCreateTask = createAsyncThunk('tasks/createTask', async (body: CreateTaskInterface) => {
  try {
    console.log(body);

    const { description, status, title, userId } = body;
    const res = await instance.post(`/tasks/user/${userId}`, { description, status, title });
    return res.data;
  } catch (error: any) {
    throw Error(error);
  }
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async (data: { status: TaskStatus; taskId: string }) => {
    try {
      console.log(data);

      const { status, taskId } = data;
      const res = await instance.patch(`/tasks/${taskId}/status`, { status });
      return res.data;
    } catch (error: any) {
      throw Error(error);
    }
  }
);
