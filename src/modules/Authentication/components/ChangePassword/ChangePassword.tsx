import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export interface ChangePassFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePassFormValues>();

  const navigate = useNavigate();

  const onSubmit = async (data: ChangePassFormValues) => {
    try {
      setIsSaving(true);
      await AuthAPI.changePassword(data);
      toast.success("Password changed successfully");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="change-password-container">
        <div className="auth-title">
          <h3>Change Password</h3>
        </div>

        <div className="change-password-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Old Password */}
            <div className="field-container my-4 auth-form-input">
              <label
                htmlFor="old-password"
                className="yellow-color d-block"
              >
                Old Password
              </label>
              <div className="input-group align-items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-transparent text-white"
                  id="old-password"
                  placeholder="Enter Your Old Password"
                  {...register("oldPassword", {
                    required: "Old Password is required",
                  })}
                />
                <span
                  className="input-group-text bg-transparent border-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                 <FontAwesomeIcon color="#FFF" icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {errors.oldPassword && (
                <div className="text-danger mt-1">
                  {errors.oldPassword.message}
                </div>
              )}
            </div>

            {/* New Password */}
            <div className="field-container my-4 auth-form-input">
              <label
                htmlFor="new-password"
                className="yellow-color d-block"
              >
                New Password
              </label>

              <div className="input-group align-items-center">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control bg-transparent text-white"
                  id="new-password"
                  placeholder="Enter Your New Password"
                  {...register("newPassword", {
                    required: "New Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <span
                  className="input-group-text bg-transparent border-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon color="#FFF" icon={showNewPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.newPassword && (
                <div className="text-danger mt-1">
                  {errors.newPassword.message}
                </div>
              )}
            </div>
            {/* Confirm Password */}
            <div className="field-container my-4 auth-form-input">
              <label
                htmlFor="confirm-new-password"
                className="yellow-color d-block"
              >
                Confirm New Password
              </label>

              <div className="input-group align-items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control bg-transparent text-white"
                  id="confirm-new-password"
                  placeholder="Confirm New Password"
                  {...register("confirmNewPassword", {
                    required: "Confirm New Password is required",
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                />

                <span
                  className="input-group-text bg-transparent border-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon color="#FFF" icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {errors.confirmNewPassword && (
                <div className="text-danger mt-1">
                  {errors.confirmNewPassword.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="btn-submit text-center">
              <button
                type="submit"
                disabled={isSaving}
                className="btn secondary-color text-white w-75 rounded-4 save-btn my-2"
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
