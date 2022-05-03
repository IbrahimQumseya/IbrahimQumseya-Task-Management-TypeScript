import { createAsyncThunk } from '@reduxjs/toolkit';
import { SignUpInterface } from '../interfaces/sign-up.inteface';
import axios from './instanceAPI';

export const RegisterUser = createAsyncThunk(
  'auth/RegisterUser',
  async (body: Omit<SignUpInterface, 'confirmedPassword'>, _thunkAPI) => {
    console.log('before try');
    try {
      console.log('try');

      const { email, firstName, lastName, password, username } = body;
      const res = await axios.post('/auth/signup', {
        email,
        firstName,
        lastName,
        password,
        username,
      });
      if (res.data === 'USER_CREATED' && res.status === 201) {
        return res.data;
      }
    } catch (error) {
      console.log(error);

      throw Error('error');
    }
  }
);
