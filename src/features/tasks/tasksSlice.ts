import { createSlice } from '@reduxjs/toolkit';
import { fetchAllTasks, fetchCreateTask } from '../../api/tasksAPI';
import { RootState } from '../../app/store';

export interface taskMetadataInterface {
  id: string;
  details: string;
  isDeactivated: boolean;
}
export interface UserInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isDeactivated: boolean;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  profileImage: string;
}
export interface TasksState {
  tasks: [
    {
      id: string;
      title: string;
      description: string;
      user: UserInterface;
      taskMetadata: taskMetadataInterface;
    }
  ];
  status: 'idle' | 'loading' | 'failed';
}
const initialState: TasksState = {
  tasks: [
    {
      id: '',
      title: '',
      description: '',
      taskMetadata: {
        details: '',
        id: '',
        isDeactivated: false,
      },
      user: {
        email: '',
        firstName: '',
        id: '',
        isDeactivated: false,
        lastName: '',
        profileImage: '',
        role: 'USER',
        username: '',
      },
    },
  ],
  status: 'idle',
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.status = 'failed';
      })

      .addCase(fetchCreateTask.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchCreateTask.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks.push(action.payload);
      })
      .addCase(fetchCreateTask.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskStatus = (state: RootState) => state.tasks.status;
export default tasksSlice.reducer;
