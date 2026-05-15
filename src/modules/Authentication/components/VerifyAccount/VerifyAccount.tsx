import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../../../api";
import { toast } from "react-toastify";
import axios from "axios";


export interface VerifyFormValues {
  email: string;
  code: string;
}

export default function VerifyAccount() {

  const {register , handleSubmit , formState:{errors}} = useForm<VerifyFormValues>();
  const navigate = useNavigate();
  
    const onSubmit = async(data:VerifyFormValues)=>{
      try {
        const response = await AuthAPI.VerifyAccount(data);
        toast.success(response?.data?.message);
        navigate('/')
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  return (
    <>
      <div className="auth-title">
        <h3>verify Account</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 d-flex flex-column form-input">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            placeholder="Enter Your Email" 
            className="form-control px-0"
            aria-describedby="emailelpBlock"
            style={{backgroundColor:'transparent',border:0,borderBottom:'1px solid #FFF' , borderRadius:0,color:'#FFF'}}
            {...register('email', {
              required:'Email is required!',
              pattern:{
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message:'Email is not valid!'
              }
            })}
          />
        </div>
        {errors.email && <span className="text-danger">{errors.email.message}</span>}
        <div className="mt-5 d-flex flex-column form-input">
          <label htmlFor="otp">OTP Verification</label>
          <input 
            type="text" 
            id="otp"
            placeholder="Enter Verification" 
            className="form-control px-0"
            aria-describedby="otpelpBlock"
            style={{backgroundColor:'transparent',border:0,borderBottom:'1px solid #FFF' , borderRadius:0,color:'#FFF'}}
            {...register('code',{
              required:'OTP is required!'
            })}
          />
        </div>
        {errors.code && <span className="text-danger">{errors.code.message}</span>}
        <div className="d-flex justify-content-center mt-3">
          <button className="btn w-75 my-4 text-white py-3 rounded-5" style={{backgroundColor:'#EF9B28',fontWeight:500}}>
            Save
          </button>
        </div>
      </form>
    </>
  )
}
