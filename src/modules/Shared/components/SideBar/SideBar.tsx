import { useContext } from "react"
import { AuthContext } from "../../../../context/AuthContext"
import { useNavigate } from "react-router-dom";


export default function SideBar() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = ()=>{
   localStorage.removeItem('token')
   authContext?.setUserData(null)
   navigate('/login')
  }
  return (
    <>
      <div className="">
        <button className="btn btn-info" onClick={logout}>logout</button>
      </div>
    </>
  )
}
