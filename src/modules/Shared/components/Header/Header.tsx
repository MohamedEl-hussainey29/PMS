import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';

export default function Header() {
  const {userData} = useContext(AuthContext)!;

  return <>
     <div className="header text-white rounded rounded-4 mt-3 bg-danger " style={{height: '300px'}}>
         
         <div className="p-5">
          <h2>Welcome <span style={{color : '#EF9B28'}}>{userData?.userName}</span> </h2>

         <p className="fs-3 pt-2">You can add project and assign tasks to your team</p>

         </div>
     </div>
  </>
}