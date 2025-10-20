import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("http://100.110.201.56:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth_token", data.access_token);
        console.log("Has iniciado sesión con éxito");

        navigate("/");
      } else {
        const dataError = await response.json();
        console.log("Error:", dataError.detail);
      }
    } catch (error) {
      console.error("Error al intentar conectar con el servidor:", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Iniciar Sesión</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            required
            value={username}
            onChange={usernameChange}
            placeholder="Ingrese el nombre de usuario"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            required
            value={password}
            onChange={passwordChange}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Ingresar
        </button>
        <p>
          No tienes una cuenta?
          <Link to="/register">Registrese aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
