import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/home";
import Clientes from "./pages/Clientes/clientes";
import Estoque from "./pages/Estoque/estoque";
import Enter from "./pages/Enter/enter";
import HomeUser from "./pages/PagesUser/HomeUser/homeUser";
import Exit from "./pages/Exit/exit";
import ControleEstoque from "./pages/ControleEstoque/controleEstoque";
import CampanhaForm from "./pages/PagesUser/Campanhas/campanhasForm";
function PrivateRoute({ element, authenticated }) {
  return authenticated ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: window.location.pathname }} />
  );
}

function RoutesApp() {
  // Defina o estado do usuário autenticado
  const [authenticated, setAuthenticated] = useState(false);

  // Função para autenticar o usuário
  const authenticateUser = () => {
    setAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login authenticateUser={authenticateUser} />}
        />
        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute
              element={<Home />}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute
              element={<Clientes />}
              authenticated={authenticated}
            />
          }
        />
         <Route
          path="/campanha"
          element={
            <PrivateRoute
              element={<CampanhaForm />}
              authenticated={authenticated}
            />
          }
        />
          <Route
          path="/HomeUser"
          element={
            <PrivateRoute
              element={<HomeUser />}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/estoque"
          element={
            <PrivateRoute
              element={<Estoque />}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/controle"
          element={
            <PrivateRoute
              element={<ControleEstoque />}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/entrada"
          element={
            <PrivateRoute
              element={<Enter />}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/Saida"
          element={
            <PrivateRoute
              element={<Exit />}
              authenticated={authenticated}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesApp;
