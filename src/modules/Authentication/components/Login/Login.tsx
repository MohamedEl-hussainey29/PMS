import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export interface LoginFormValues {
  email: string;
  password: string;
}
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {register , handleSubmit , formState:{errors}} = useForm<LoginFormValues>();
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }
  const { saveUserData } = authContext;
  
  const onSubmit = async(data:LoginFormValues)=>{
    setIsLoading(true);
    try {
      const response = await AuthAPI.Login(data);
      localStorage.setItem('token' , response?.data?.token);
      saveUserData();
      toast.success("Logged in!");
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Invalid email or password"
        );
      } else {
        toast.error("Something went wrong");
      }
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="auth-title">
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 d-flex flex-column auth-form-input">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            placeholder="Enter Your Email" 
            className="form-control px-0"
            aria-describedby="emailelpBlock"
            style={{
                backgroundColor: "transparent",
                border: 0,
                borderBottom: "1px solid #FFF",
                borderRadius: 0,
                color: "#FFF",
                boxShadow: "none",
              }}
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
        <div className="mt-5 d-flex flex-column auth-form-input">
          <label htmlFor="password">Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Your Password"
              className="form-control px-0 pe-5"
              aria-describedby="otpelpBlock"
              style={{
                backgroundColor: "transparent",
                border: 0,
                borderBottom: "1px solid #FFF",
                borderRadius: 0,
                color: "#FFF",
                boxShadow: "none",
              }}
              {...register("password", {
                required: "Password is required!",
                minLength: {
                  value: 8,
                  message: "Password should be at least 8 characters!",
                },
              })}
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y pe-2"
              style={{cursor: "pointer",backgroundColor: "transparent",color: "#FFF"}}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>
        {errors.password && <span className="text-danger">{errors.password.message}</span>}
        <div className="links d-flex justify-content-between my-4">
          <Link to='/register' className="text-decoration-none " style={{color:'#FFF'}}>Register Now?</Link>
          <Link to='/forget-pass' className="text-decoration-none " style={{color:'#FFF'}}>Forgot Password?</Link>
        </div>
        <div className="d-flex justify-content-center ">
          <button disabled={isLoading} className="btn w-75 my-3 text-white py-3 rounded-5" style={{backgroundColor:'#EF9B28',fontWeight:500}}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </>
  )
}
