import { useNavigate } from 'react-router-dom';
import authLogo from '../../../../assets/PMS 3.png';
import notFoundImg from "../../../../assets/notFound.jpeg";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="notFound-container position-relative min-vh-100 bg-white d-flex flex-column justify-content-center align-items-center text-center p-3">

        <div className="position-absolute top-0 start-0">
          <img src={authLogo} alt="authLogo" className="img-fluid w-75" />
        </div>

        <div className="d-flex flex-column align-items-center col-11 col-sm-8 col-md-5 col-lg-4">

          <div className="w-100">
            <img
              src={notFoundImg}
              alt="notFound Image"
              className="img-fluid"
            />
            <h1 className="display-1 fw-bold text-warning mb-1 lh-1">404</h1>

            <h3 className="fw-bold text-dark mb-2 fs-4">Page Not Found</h3>

            <p className="text-muted fw-bold mb-4 small px-3">
              The Page You Are Looking For Doesn't exist.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-warning text-white fw-semibold w-75 py-2.5 rounded-5 shadow-sm"
            >
              Return Home
            </button>
          </div>

        </div>
      </div>
    </>
  );
}