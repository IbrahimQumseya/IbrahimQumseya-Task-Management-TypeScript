import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersByAdmin } from '../api/userAPI';
import { RootState } from '../app/store';
import { setUserIdToAddTask } from '../features/user/usersSlice';
import { UserRoleEnum } from '../interfaces/data.interface';

function SelectUser() {
  const users = useSelector((state: RootState) => state.users.users);
  const userId = useSelector((state: RootState) => state.users.userId);
  const userRole = useSelector((state: RootState) => state.user.user.role);
  const dispatch = useDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setUserIdToAddTask(event.target.value as string));
  };

  useEffect(() => {
    if (userRole === UserRoleEnum.ADMIN) {
      dispatch(getAllUsersByAdmin());
    }
  }, [dispatch, userRole]);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>User</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={userId}
          label='Age'
          onChange={handleChange}
        >
          {users.length > 0 &&
            users
              .filter((user) => user.role !== UserRoleEnum.ADMIN)
              .map((user) => {
                return (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                );
              })}
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectUser;
