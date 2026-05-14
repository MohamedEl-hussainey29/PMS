import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";


export default function MasterLayout() {
  return <>
  <div className="vh-100">

     <NavBar/>

     <div className="d-flex">
      <div className="bg-danger">
        <SideBar/>
      </div>
      <div className="w-100 bg-success">
        <Header/>
        <Outlet/>
      </div>

     </div>
  </div>
  
  </>
}
