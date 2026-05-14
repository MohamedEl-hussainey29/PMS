import { Outlet } from "react-router-dom";
import authLogo from '../../../../assets/PMS 3.svg'


export default function AuthLayout() {
  return <>
      <div className="auth-container ">
        <div className="container-fluid">   
          <div className="row flex-column justify-content-center align-items-center vh-100">
            <img src={authLogo} alt="authLogo" className="w-25"/>
            <div className="col-md-6 rounded rounded-3 shadow p-5 auth-form">
              <span className="text-white">Welcome to PMS</span>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
  
  </>
}
