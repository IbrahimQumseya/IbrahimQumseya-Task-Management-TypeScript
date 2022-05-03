import { Avatar, Box, Button, Container, Grid, IconButton, Input, Stack, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import BasicAlerts from '../../components/alert/BasicAlerts';
import SignIn from '../../features/auth/SignIn';
import { RootState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { BodyCreateUserDetails, BodyUpdateUserDetails, UserDetails } from '../../interfaces/data.interface';
import {
  createUserDetails,
  fetchGetUserDetails,
  getUserProfileImage,
  updateUserDetails,
  updateUserProfile,
} from '../../api/userAPI';
import { setUserFirstLastName } from '../../features/user/userSlice';

interface UserWithUserDetails extends UserDetails {
  firstName: string;
  lastName: string;
  id: string;
  profileImage: string;
}

const UserProfile = () => {
  const profileImage = useSelector((state: RootState) => state.user.profileImage);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const status = useSelector((state: RootState) => state.user.status);
  const user = useSelector((state: RootState) => state.user.user);
  const doesUserHaveProfilePicture = useSelector((state: RootState) => state.user.user.profileImage);
  const selectUserProfileImage = useSelector((state: RootState) => state.user.profileImage);
  const dispatch = useDispatch();

  const [enableEdit, setEnableEdit] = useState<boolean>(true);

  const [state, setState] = useState<UserWithUserDetails>({
    address: '',
    id: '',
    location: '',
    number: '',
    telephone: '',
    firstName: '',
    lastName: '',
    profileImage: '',
  });

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    dispatch(fetchGetUserDetails());
    if (doesUserHaveProfilePicture && !profileImage) {
      console.log('ASDASD');
      dispatch(getUserProfileImage());
    }
  }, [dispatch, doesUserHaveProfilePicture]);

  useEffect(() => {
    if (!selectUserProfileImage.match('blob:')) {
      dispatch(getUserProfileImage());
    }
  }, [dispatch, selectUserProfileImage]);

  useEffect(() => {
    setState({
      address: userDetails.address || '',
      id: user.id || '',
      location: userDetails.location || '',
      number: userDetails.number || '',
      telephone: userDetails.telephone || '',
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: selectUserProfileImage || '',
    });
    if (message) {
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [userDetails, message, user]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      userDetails.location &&
      userDetails.address &&
      userDetails.number &&
      userDetails.telephone &&
      user.firstName &&
      user.lastName
    ) {
      const { address, firstName, number, telephone, lastName, location } = state;
      const bodyParameters: BodyUpdateUserDetails = {
        firstName,
        lastName,
        location: location,
        address,
        number: String(number),
        telephone: String(telephone),
      };
      dispatch(updateUserDetails(bodyParameters));
      setEnableEdit(!enableEdit);
      setMessage('User has been updated cu success');
      dispatch(setUserFirstLastName({ firstName: firstName, lastName: lastName }));
    }
    if (
      userDetails.location === '' &&
      userDetails.address === '' &&
      userDetails.number === '' &&
      userDetails.telephone === ''
    ) {
      const { id, number, profileImage, address, telephone, location } = state;
      const bodyParametersNew: BodyCreateUserDetails = {
        idUser: id,
        location,
        address,
        number: String(number),
        telephone: String(telephone),
      };
      dispatch(createUserDetails(bodyParametersNew));
    }
    dispatch(fetchGetUserDetails());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleChangeImage = (e: any) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (file) {
      formData.append('file', file);
      dispatch(updateUserProfile(formData));
    }
    if (!state.profileImage.match('blob:')) {
      console.log('match');
      dispatch(getUserProfileImage());
    }
  };

  if (isAuthenticated) {
    return (
      <Container maxWidth='md' component='main'>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack direction='row' spacing={2} m={3} style={{ width: 100, height: 100 }}>
            <label htmlFor='icon-button-file'>
              <input hidden accept='image/*' id='icon-button-file' type='file' onChange={handleChangeImage} />
              <IconButton color='primary' aria-label='upload picture' component='span'>
                <Avatar
                  alt={state.profileImage}
                  src={selectUserProfileImage || state.profileImage}
                  sx={{ width: 100, height: 100 }}
                />
              </IconButton>
            </label>
          </Stack>
          <Typography component='h1' variant='h5'>
            User Details
          </Typography>
          <Box
            sx={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'right',
              alignSelf: 'flex-end',
              marginRight: 5,
            }}
          >
            <IconButton
              type='submit'
              onClick={() => setEnableEdit(!enableEdit)}
              sx={{ mt: 3, mb: 2, height: 45, width: 50 }}
            >
              <ModeEditIcon />
            </IconButton>
          </Box>
          {status === 'idle' && (
            <Box sx={{ m1: 2 }} component='form' noValidate>
              <TextField
                margin='normal'
                fullWidth
                id='firstName'
                type='firstName'
                name='firstName'
                disabled={enableEdit}
                label='first Name'
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.firstName}
                onChange={handleChange}
              />
              <TextField
                margin='normal'
                fullWidth
                id='lastName'
                name='lastName'
                type='lastName'
                disabled={enableEdit}
                label='last Name'
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.lastName}
                onChange={handleChange}
              />
              <TextField
                margin='normal'
                fullWidth
                id='location'
                name='location'
                disabled={enableEdit}
                label='location'
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.location}
                // value={location ? location : userDetails.location}
                onChange={handleChange}
              />

              <TextField
                margin='normal'
                fullWidth
                id='number'
                name='number'
                type='number'
                disabled={enableEdit}
                label='number'
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.number}
                onChange={handleChange}
              />
              <TextField
                margin='normal'
                fullWidth
                id='telephone'
                name='telephone'
                type='number'
                disabled={enableEdit}
                InputLabelProps={{
                  shrink: true,
                }}
                label='telephone'
                value={state.telephone}
                onChange={handleChange}
              />
              <TextField
                margin='normal'
                fullWidth
                id='address'
                name='address'
                label='address'
                disabled={enableEdit}
                InputLabelProps={{
                  shrink: true,
                }}
                value={state.address}
                onChange={handleChange}
              />
              {message && <BasicAlerts severity='success' message={message} />}
              <Grid container>
                <Button
                  type='submit'
                  onClick={handleSubmit}
                  variant='contained'
                  sx={{ mt: 3, mb: 2, height: 45 }}
                  disabled={enableEdit}
                >
                  Submit Changes
                </Button>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    );
  }
  return <SignIn />;
};

export default UserProfile;
