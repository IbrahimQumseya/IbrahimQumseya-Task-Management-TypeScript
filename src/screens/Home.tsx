import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import AddTaskToTable from '../components/AddTaskToTable';
import TasksTable from '../components/TasksTable';
import SignIn from '../features/auth/SignIn';
import { UserRoleEnum } from '../interfaces/data.interface';

function Home() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const userRole = useSelector((state: RootState) => state.user.user.role);
  if (!isAuthenticated) {
    return <SignIn />;
  }
  if (userRole === UserRoleEnum.ADMIN) {
    return (
      <div>
        <AddTaskToTable />
        <TasksTable />
      </div>
    );
  } else {
    return (
      <div style={{ paddingTop: '50px' }}>
        <TasksTable />
      </div>
    );
  }
}

export default Home;
