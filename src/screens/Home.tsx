import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import AddTaskToTable from '../components/AddTaskToTable';
import TasksTable from '../components/TasksTable';
import SignIn from '../features/auth/SignIn';

function Home() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  if (!isAuthenticated) {
    return <SignIn />;
  }
  return (
    <div>
      <AddTaskToTable />
      <TasksTable />
    </div>
  );
}

export default Home;
