import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import axios from '../../api/instanceAPI';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch } from 'react-redux';
import { login } from '../user/userSlice';
import { useNavigate } from 'react-router-dom';
import { SignInInterface } from '../../interfaces/data.interface';

const theme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState<SignInInterface>({
    username: '',
    password: '',
  });

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { password, username } = state;
    if (username && password) {
      try {
        const res: any = await axios.post('/auth/signin', {
          username,
          password,
        });
        console.log(res);

        const token = res?.data?.accessToken;
        if (token) {
          dispatch(login(token));
          navigate('/home');
        }
      } catch (error) {
        throw Error('error');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* <Typography component='h4' variant='h5'>
              Lost your password? Please enter your email address. You will receive a link to create a new password via email.
            </Typography> */}
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='username'
              name='username'
              value={state.username}
              autoComplete='username'
              onChange={handleOnchange}
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              value={state.password}
              onChange={handleOnchange}
              id='password'
              autoComplete='current-password'
            />
            <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href='/register' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
