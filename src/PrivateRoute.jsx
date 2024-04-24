import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PrivateRoute({ element, authenticated }) {
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      setShouldNavigate(true);
    }
  }, [authenticated]);

  useEffect(() => {
    const handleNavigate = () => {
      if (shouldNavigate) {
        navigateToLogin();
      }
    };

    handleNavigate();
  }, [shouldNavigate, navigate]);

  const navigateToLogin = () => {
    navigate("/", { replace: true, state: { from: window.location.pathname } });
  };

  return authenticated ? element : null;
}

export default PrivateRoute;
