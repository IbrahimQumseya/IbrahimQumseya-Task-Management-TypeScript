import { Action, ActionReducerMapBuilder, PayloadAction, Slice } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RegisterUser } from '../../api/authAPI';
import {
  createUserDetails,
  fetchGetUserDetails,
  getUserProfileImage,
  updateUserDetails,
  updateUserProfile,
} from '../../api/userAPI';
import { RootState } from '../../app/store';
import { UserDetails, UserRoleEnum } from '../../interfaces/data.interface';

export interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRoleEnum;
    profileImage: string;
  };
  userDetails: UserDetails;
  profileImage: string;

  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  isAuthenticated: false,
  user: {
    id: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: UserRoleEnum.USER,
    profileImage: '',
  },
  profileImage: '',
  userDetails: {
    id: '',
    location: '',
    address: '',
    number: '',
    telephone: '',
  },

  status: 'idle',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: UserState, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      sessionStorage.setItem('user', action.payload);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      sessionStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    setUserFirstLastName: (state, action) => {
      const { firstName, lastName } = action.payload;
      state.user = { ...state.user, firstName, lastName };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(RegisterUser.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(RegisterUser.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(fetchGetUserDetails.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(fetchGetUserDetails.fulfilled, (state, action) => {
        if (action.payload) {
          state.userDetails = action.payload;
        }
        state.status = 'idle';
      })
      .addCase(fetchGetUserDetails.rejected, (state, _action) => {
        state.status = 'failed';
      })

      .addCase(updateUserDetails.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;

        state.status = 'idle';
      })
      .addCase(updateUserDetails.rejected, (state, _action) => {
        state.status = 'failed';
      })

      .addCase(createUserDetails.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(createUserDetails.fulfilled, (state, action) => {
        const { address, firstName, lastName, location, number, telephone } = action.payload;
        state.userDetails = { ...state.userDetails, address, location, number, telephone };
        state.user = { ...state.user, firstName, lastName };
        state.status = 'idle';
      })
      .addCase(createUserDetails.rejected, (state, _action) => {
        state.status = 'failed';
      })

      .addCase(getUserProfileImage.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(getUserProfileImage.fulfilled, (state, action) => {
        state.user.profileImage = action.payload;
        state.status = 'idle';
      })
      .addCase(getUserProfileImage.rejected, (state, _action) => {
        state.status = 'failed';
      })

      .addCase(updateUserProfile.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileImage = action.payload.profileImage;

        state.status = 'idle';
      })
      .addCase(updateUserProfile.rejected, (state, _action) => {
        state.status = 'failed';
      });
  },
});

export const selectUserState = (state: RootState) => state.user;
export const { login, logout, setUserProfileImage, setUser, setUserFirstLastName } = userSlice.actions;
export default userSlice.reducer;
