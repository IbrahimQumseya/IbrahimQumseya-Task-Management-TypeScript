import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { getAllUsersByAdmin } from '../../api/userAPI';
import { RootState } from '../../app/store';
import { UserRoleEnum } from '../../interfaces/data.interface';
import { UserState } from './userSlice';

export interface UsersState {
  users: [
    {
      id: string;
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
      role: UserRoleEnum;
      profileImage: string;
    }
  ];
  userId: string;
  status: 'idle' | 'loading' | 'failed';
}
const initialState: UsersState = {
  users: [
    {
      id: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      role: UserRoleEnum.USER,
      profileImage: '',
    },
  ],
  userId: '',
  status: 'idle',
};
export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserIdToAddTask: (state, action) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
      .addCase(getAllUsersByAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsersByAdmin.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload;
      })
      .addCase(getAllUsersByAdmin.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {setUserIdToAddTask} = userSlice.actions;
export default userSlice.reducer;
