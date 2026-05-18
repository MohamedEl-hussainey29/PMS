
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import {  useState } from "react";


export interface ChangePassFormValues {

  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string

}
export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false)
    const {register , handleSubmit , formState:{errors}} = useForm<ChangePassFormValues>();
    const navigate = useNavigate();

  
  const onSubmit = async(data:ChangePassFormValues)=>{
    try {
      setIsSaving(true)
      const response = await AuthAPI.changePassword(data);
  setIsSaving(false)
      toast.success("change password done");
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }
    
  
  return <>
  <div className="change-password-container">
    <div className="auth-title">
      <h3>Change Password</h3>
    </div>
    <div className="change-password-form ">
      <form onSubmit={handleSubmit(onSubmit)}>
       <div className="field-container my-2">
         <label htmlFor="old-password" className="yellow-color d-block">Old Password</label>
        <div className="input-group  align-items-center">
          <input type={showPassword?"text":"password"} className="form-control bg-transparent " id="old-password" placeholder=" Enter Your Old Password" 
           {...register("oldPassword", {
              required: "Old Password is required"
            })}
          
          />
        {showPassword?<i onClick={()=>setShowPassword(false)} className="fas fa-eye-slash text-white fs-6"></i>:  <i onClick={()=>setShowPassword(true)} className="fas fa-eye text-white fs-6"></i>}
         
        </div>
        {errors.oldPassword && (
          <div className="text-danger mt-1">
            {errors.oldPassword.message}
          </div>
        )}

       </div>
       <div className="field-container my-2">
         <label htmlFor="new-password" className="yellow-color d-block">New Password</label>
        <div className="input-group  align-items-center">
          <input type={showPassword?"text":"password"} className="form-control bg-transparent " id="old-password" placeholder=" Enter Your New Password"  
             {...register("newPassword", {
              required: "New Password is required"
            })}
          
          />
        {showPassword?<i onClick={()=>setShowPassword(false)} className="fas fa-eye-slash text-white fs-6"></i>:  <i onClick={()=>setShowPassword(true)} className="fas fa-eye text-white fs-6"></i>}
         
        </div>
        {errors.newPassword && (
          <div className="text-danger mt-1">
            {errors.newPassword.message}
          </div>
        )}

       </div>
       <div className="field-container my-2">
         <label htmlFor="confirm-new-password" className="yellow-color d-block">Confirm New Password</label>
        <div className="input-group  align-items-center">
          <input type={showPassword?"text":"password"} className="form-control bg-transparent " id="old-password" placeholder=" Confirm New Password" 
             {...register("confirmNewPassword", {
              required: "Confirm New Password is required"
            })}
          
          />
        {showPassword?<i onClick={()=>setShowPassword(false)} className="fas fa-eye-slash text-white fs-6"></i>:  <i onClick={()=>setShowPassword(true)} className="fas fa-eye text-white fs-6"></i>}
         
        </div>
          {errors.confirmNewPassword && (
          <div className="text-danger mt-1">
            {errors.confirmNewPassword.message}
          </div>
        )}
       </div>
    <div className="btn-submit text-center">
      {isSaving?   <button className="btn secondary-color  text-white w-75 rounded rounded-4 save-btn my-2"><i className="fas fa-spin fa-spinner mx-1 "></i>Saving</button>:   <button className="btn secondary-color  text-white w-75 rounded rounded-4 save-btn my-2">Save</button>}
    </div>
      </form>
    </div>
  </div>
  
  </>
}
