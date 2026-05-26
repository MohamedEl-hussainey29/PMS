/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import Spinner from "../Spinner/Spinner";


export default function MasterLayout() {
    const { isLoading }: any = useContext(AuthContext);
  return( 
    <>
      <div className="">

        <NavBar/>

        <div className="d-flex overflow-hidden" style={{height : 'calc(100vh - 70px)'}}>

          <div style={{height: '100%', flexShrink: 0}}>
            <SideBar/>
          </div>

          <main className="flex-grow-1 overflow-auto">
            {isLoading? <Spinner/> : <Outlet/>}
          </main>

        </div>
      </div>
    </>
  )
}
