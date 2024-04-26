import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import logo from "../../img/logoTIpo.jpg"
import logo3 from "../../img/logo3.png";
import { Token } from "@mui/icons-material";

function Login({authenticateUser}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail"); // Retrieve user's email from localStorage
  
    if (token) {
      authenticateUser(); // Assuming token-based authentication
      if (userEmail === "rh@gmail.com") {
        navigate("/home");
      } else if (userEmail === "user@gmail.com") {
        navigate("/homeUser");
      }
    } else {
      // Handle case when token is not present or invalid
      // You might want to redirect to a login page or display an error message
    }
  }, [authenticateUser, navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
  
      if (response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email); // Store user's email in localStorage
        if (email === "rh@gmail.com") {
          navigate("/home");
        } else {
          navigate("/homeUser");
        }
        toast.success("Login bem-sucedido");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Email ou senha inválidos");
        } else {
          toast.error("Erro no servidor. Tente novamente mais tarde.");
        }
      } else {
        toast.error("Erro na requisição. Verifique sua conexão.");
      }
    }
  };

  return (
    <div className="containerLogin">
      <div className="areaImg">
        <div className="logotipo">
        <img src={logo3} alt="img" />
        </div>
      </div>

      <div className="login-form-wrap">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <div>
        <div className="campNameLogo" >
          <img src={logo} className="LogoName"/>
        </div>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <button
            type="submit"
            className="btn-login"
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
