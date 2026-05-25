import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";


export default function MasterLayout() {
  return <>
  {/* <div className="h-100">

     <NavBar/>

     <div className="d-flex">
      <div className="">
        <SideBar/>
      </div>
      <div className="w-100">
        <Outlet/>
      </div>

     </div>
  </div> */}

  <div className="">

     <NavBar/>

     <div className="d-flex overflow-hidden" style={{height : 'calc(100vh - 70px)'}}>

      <div style={{height: '100%', flexShrink: 0}}>
        <SideBar/>
      </div>

      <main className="flex-grow-1 overflow-auto">
        <Outlet/>
      </main>

     </div>
  </div>
  
  </>
}
