import { useState } from "react";
import { AuthAPI } from "../../../../api";
import personalImg from "../../../../assets/personalImg.png";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export interface registerFormValues {
  userName: string;
  email: string;
  country: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  profileImage?: FileList;
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(personalImg);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<registerFormValues>({
    mode: "onChange",
  });

  const profileImageRegister = register("profileImage");
  const password = watch("password");

  const appendToFormData = (data: registerFormValues) => {
    const formData = new FormData();

    formData.append("userName", data.userName);
    formData.append("country", data.country);
    formData.append("password", data.password);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("confirmPassword", data.confirmPassword);

    if (data.profileImage?.[0]) {
      formData.append("profileImage", data.profileImage[0]);
    }

    return formData;
  };

  const onSubmit = async (data: registerFormValues) => {
    console.log(data.profileImage);
    console.log(data.profileImage?.[0]);
    const formData = appendToFormData(data);
    setIsLoading(true);
    try {
      const response = await AuthAPI.Register(formData);
      console.log(response.data);

      toast.success(response.data.message);
      navigate("/verify-account");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-title">
        <h3>Create New Account</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="image text-center pt-1">
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="form-control"
              hidden
              {...profileImageRegister}
              onChange={(e) => {
                profileImageRegister.onChange(e);
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  // profileImageRegister.onChange(e);
                  setValue("profileImage", e.target.files as FileList);
                }
              }}
            />
            <label
              htmlFor="profileImage"
              style={{
                cursor: "pointer",
                position: "relative",
                width: "95px",
                height: "95px",
                display: "inline-block",
              }}
            >
              <FontAwesomeIcon
                className="fs-4 z-3"
                style={{
                  color: "#EF9B2899",
                  cursor: "pointer",
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%)",
                }}
                icon={faCamera}
              />
              <img
                src={preview}
                alt="personal image"
                style={{
                  width: "95px",
                  height: "95px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(rgba(49, 89, 81, 0.54), rgba(49, 89, 81, 0.54))",
                  borderRadius: "50%",
                }}
              ></div>
            </label>
          </div>

          <div className="col-md-6">
            <div className="mt-5 d-flex flex-column auth-form-input">
              <label htmlFor="userName">User Name</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your name"
                className="form-control px-0"
                aria-describedby="userNameHelpBlock"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "1px solid #FFF",
                  borderRadius: 0,
                  color: "#FFF",
                }}
                {...register("userName", {
                  required: "UserName is required!",
                  pattern: {
                    value: /^(?=.*\d$)[a-zA-Z0-9]{1,8}$/,
                    message:
                      "userName may not be greater than 8 characters, and end with numbers without spaces.",
                  },
                })}
              />
            </div>
            {errors.userName && (
              <span className="text-danger">{errors.userName.message}</span>
            )}

            <div className="mt-4 d-flex flex-column auth-form-input">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                placeholder="Enter your country"
                className="form-control px-0"
                aria-describedby="CountryHelpBlock"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "1px solid #FFF",
                  borderRadius: 0,
                  color: "#FFF",
                }}
                {...register("country", {
                  required: "Country is required!",
                })}
              />
            </div>
            {errors.country && (
              <span className="text-danger">{errors.country.message}</span>
            )}

            <div className="mt-4 d-flex flex-column auth-form-input position-relative ">
              {showPassword ? (
                <span
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className="icon pointer" />
                </span>
              ) : (
                <span
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {" "}
                  <FontAwesomeIcon icon={faEyeSlash} className="icon pointer" />
                </span>
              )}

              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your Password"
                className="form-control px-0"
                aria-describedby="passwordHelpBlock"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "1px solid #FFF",
                  borderRadius: 0,
                  color: "#FFF",
                }}
                {...register("password", {
                  required: "Password is required!",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                  },
                })}
              />
            </div>
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
          </div>

          <div className="col-md-6">
            <div className="mt-5 d-flex flex-column auth-form-input">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your E-mail"
                className="form-control px-0"
                aria-describedby="emailHelpBlock"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "1px solid #FFF",
                  borderRadius: 0,
                  color: "#FFF",
                }}
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Email is not valid!",
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}

            <div className="mt-4 d-flex flex-column auth-form-input">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                className="form-control px-0"
                aria-describedby="phoneNumberHelpBlock"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "1px solid #FFF",
                  borderRadius: 0,
                  color: "#FFF",
                }}
                {...register("phoneNumber", {
                  required: "PhoneNumber is required!",
                  pattern: {
                    value: /^\+?[0-9\s\-()]{10,15}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-danger">{errors.phoneNumber.message}</span>
            )}

            <div className="mt-4 d-flex flex-column auth-form-input position-relative">
              {showConfirmPassword ? (
                <span
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className="icon pointer" />
                </span>
              ) : (
                <span
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {" "}
                  <FontAwesomeIcon icon={faEyeSlash} className="icon pointer" />
                </span>
              )}
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm New Password"
                className="form-control px-0"
                aria-describedby="confirmPasswordHelpBlock"
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "1px solid #FFF",
                  borderRadius: 0,
                  color: "#FFF",
                }}
                {...register("confirmPassword", {
                  required: "ConfirmPassword is required!",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-danger">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn w-75 my-3 text-white py-2 fs-5 rounded-5"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#97692a" : "#EF9B28",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.8 : 1,
              fontWeight: 500,
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>{" "}
                Submitting...{" "}
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
