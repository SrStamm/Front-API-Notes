import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  // Declaración de los estados
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // Funciones para cambiar los estados
  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Evento para crear un usuario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      username: username,
      password: password,
      email: email,
    };

    try {
      const response = await fetch("http://100.110.201.56:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        console.log("Usuario creado exitosamente");

        navigate("/login");
      } else {
        const dataError = await response.json();
        console.error("Error:", dataError.detail);
      }
    } catch (error) {
      console.log("Error inesperado al crear el usuario", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registrarse</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            required
            value={username}
            onChange={usernameChange}
            placeholder="Ingrese un nombre de usuario"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            required
            value={email}
            onChange={emailChange}
            placeholder="Ingrese un email"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            required
            value={password}
            onChange={passwordChange}
            placeholder="Ingrese una contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
        <p>
          Ya tienes una cuenta?
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
