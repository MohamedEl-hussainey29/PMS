import { Outlet } from "react-router-dom";
import authLogo from '../../../../assets/PMS 3.svg'


export default function AuthLayout() {
  return <>
      <div className="auth-container ">
        <div className="container-fluid">   
          <div className="row flex-column justify-content-center align-items-center vh-100">
            <img src={authLogo} alt="authLogo" className="col-2"/>
            <div className="col-md-7 rounded rounded-3 shadow py-3 px-5 auth-form">
              <small className="text-white">Welcome to PMS</small>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
  
  </>
}
