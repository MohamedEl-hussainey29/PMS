/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form"
import { AuthAPI } from "../../../../api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export interface ResetPassFormValues {
  email: string,
  password: string,
  confirmPassword: string,
  seed: string
}
export default function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPassFormValues>()
  const navigate = useNavigate()
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (data: ResetPassFormValues) => {
    setIsLoading(true)
    try {
      const response = await AuthAPI.ResetPass(data)
      console.log(response);
      toast.success(response?.data?.message);
      navigate("/login")
    } catch (error) {
      console.log(error);
      const err = error as any;
      const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(errorMessage);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="auth-title">
        <h3>Reset Password</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 d-flex flex-column form-input auth-form-input">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="form-control px-0 auth-input"
            aria-describedby="emailelpBlock"
            placeholder="Enter your E-mail"
            {...register('email', {
              required: 'Email is required!',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Email is not valid!'
              }
            })}
          />
        </div>
        {errors.email && <span className="text-danger">{errors.email.message}</span>}

        <div className="my-3 d-flex flex-column form-input auth-form-input">
          <label htmlFor="code">OTP Verification</label>
          <input
            type="text"
            className="form-control px-0 auth-input"
            aria-describedby="codelpBlock"
            placeholder="Enter Verification"
            {...register('seed', {
              required: 'OTP is required!',
            })}
          />
        </div>
        {errors.seed && <span className="text-danger">{errors.seed.message}</span>}
        <div className="my-3 form-input auth-form-input">
          <label htmlFor="password">New Password</label>
          <div className="input-group">
            <input
              type={showNewPassword ? "text" : "password"}
              className="form-control px-0 auth-input"
              placeholder="Enter your New Password"
              {...register('password', {
                required: 'Password is required!',
              })}
            />
            <span
              className="input-group-text bg-transparent border-0"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                color="#FFF"
                icon={showNewPassword ? faEyeSlash : faEye}
              />
            </span>
          </div>
        </div>
        {errors.password && <span className="text-danger">{errors.password.message}</span>}

        <div className="my-3 form-input auth-form-input">
          <label htmlFor="confirmPassword">New Password</label>
          <div className="input-group">
            <input
              type={showNewPassword ? "text" : "password"}
              className="form-control px-0 auth-input"
              placeholder="Enter your New Password"
             {...register('confirmPassword', {
              required: 'confirmation is required!',
              validate: (value) => value === watch('password') || "Passwords do not match!"
            })}
            />
            <span
              className="input-group-text bg-transparent border-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                color="#FFF"
                icon={showNewPassword ? faEyeSlash : faEye}
              />
            </span>
          </div>
        </div>
        {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}

        <div className="d-flex justify-content-center mt-3">
          <button disabled={isLoading} className="btn w-75 my-3 text-white py-3 rounded-5" style={{backgroundColor:'#EF9B28',fontWeight:500}}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span> Saving
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </>
  )
}