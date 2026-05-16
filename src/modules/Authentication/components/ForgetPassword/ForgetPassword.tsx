import { useForm } from "react-hook-form";
import { AuthAPI } from "../../../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface ForgetPassFormValues {
  email: string
}
export default function ForgetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgetPassFormValues>()
  const navigate = useNavigate()
  const onSubmit = async (data: ForgetPassFormValues) => {
    try {
      const response = await AuthAPI.ForgetPass(data)
      console.log(response);
      toast.success(response?.data?.message);
      navigate("/reset-pass")
    } catch (error) {
      console.log(error);
      const err = error as any;
      const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  }
  return (
    <>
      <div className="auth-title">
        <h3>Forget Password</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 d-flex flex-column form-input">
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

        <div className="d-flex justify-content-center mt-3">
          <button className="btn w-75 my-4 text-white py-3 rounded-5" style={{ backgroundColor: '#EF9B28', fontWeight: 500 }}>
            Verfiy
          </button>
        </div>
      </form>
    </>
  )
}