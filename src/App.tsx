import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import { ToastContainer } from 'react-toastify';
import AuthLayout from './modules/Shared/components/AuthLayout/AuthLayout';
import NotFound from './modules/Shared/components/NotFound/NotFound';
import Login from './modules/Authentication/components/Login/Login';
import Register from './modules/Authentication/components/Register/Register';
import ResetPassword from './modules/Authentication/components/ResetPassword/ResetPassword';
import ForgetPassword from './modules/Authentication/components/ForgetPassword/ForgetPassword';
import ChangePassword from './modules/Authentication/components/ChangePassword/ChangePassword';
import VerifyAccount from './modules/Authentication/components/VerifyAccount/VerifyAccount';
import MasterLayout from './modules/Shared/components/MasterLayout/MasterLayout';
import Dashboard from './modules/Dashboard/components/Dashboard';
import ProjectsList from './modules/Projects/components/ProjectsList';
import ProjectData from './modules/Projects/components/ProjectData';
import TasksList from './modules/Tasks/components/TasksList';
import TaskData from './modules/Tasks/components/TaskData';
import UsersList from './modules/Users/components/UsersList';
import ProtectedRoute from './modules/Shared/components/ProtectedRoute/ProtectedRoute';
import TaskBoard from './modules/Tasks/components/TaskBoard';


function App() {
  
  const routes = createBrowserRouter([
     {
      path: "/",
      element: <AuthLayout/>,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <Login/> },
        { path: "login", element: <Login/> },
        { path: "register", element: <Register/> },
        { path: "reset-pass", element: <ResetPassword/> },
        { path: "forget-pass", element: <ForgetPassword/> },
        { path: "change-pass", element: <ChangePassword/> },
        { path: "verify-account", element: <VerifyAccount/> },
      ],
    },

     {
        path:"dashboard" ,
        element:<MasterLayout/>,
        errorElement:<NotFound/>,
        children:[
          {index:true , element : <Dashboard/>},
          {path:"projects" , element:<ProjectsList/>} ,
          {path:"project-data" , element:<ProtectedRoute role={'Manager'}><ProjectData/></ProtectedRoute>} ,
          {path:"project-data/:projectId" , element:<ProtectedRoute role={'Manager'}><ProjectData/></ProtectedRoute>} ,
          {path:"tasks" , element:<ProtectedRoute role={'Manager'}><TasksList/></ProtectedRoute>} ,
          {path:"task-data" , element:<ProtectedRoute role={'Manager'}><TaskData/></ProtectedRoute>} ,
          {path:"task-data/:taskId" , element:<ProtectedRoute role={'Manager'}><TaskData/></ProtectedRoute>} ,
          {path:"task-board" , element:<ProtectedRoute role={'Employee'}><TaskBoard/></ProtectedRoute>} ,
          {path:"users" , element:<ProtectedRoute role={'Manager'}><UsersList/></ProtectedRoute>} ,
          
        ]

      }
  
  
  ])

  return (
    <>
      <ToastContainer/>
      <RouterProvider router={routes}></RouterProvider>

    </>
  )
}

export default App
