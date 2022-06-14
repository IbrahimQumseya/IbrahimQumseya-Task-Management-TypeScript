import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import usersReducer from '../features/user/usersSlice';
import tasksReducer from '../features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    users: usersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
