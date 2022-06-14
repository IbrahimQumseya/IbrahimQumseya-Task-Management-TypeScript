import { createSlice } from '@reduxjs/toolkit';
import { fetchCreateTask, fetchAllTasksByAdmin, fetchAllTasksByUser, updateTaskStatus } from '../../api/tasksAPI';
import { RootState } from '../../app/store';
import { TaskStatus } from '../../interfaces/data.interface';

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
      status?: TaskStatus;
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
      status: TaskStatus.OPEN,
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
      .addCase(fetchAllTasksByAdmin.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTasksByAdmin.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasksByAdmin.rejected, (state, action) => {
        state.status = 'failed';
      })

      .addCase(fetchAllTasksByUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTasksByUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasksByUser.rejected, (state, action) => {
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
      })

      .addCase(updateTaskStatus.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.status = 'idle';
        const { status, taskId } = action.meta.arg;
        if (status != undefined) {
          state.tasks.find((task) => task.id === taskId)!.status = status;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskStatus = (state: RootState) => state.tasks.status;
export default tasksSlice.reducer;
