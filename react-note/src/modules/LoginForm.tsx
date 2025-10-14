function LoginForm() {
  return (
    <div className="form-container">
      <h2 className="form-title">Iniciar Sesión</h2>
      <form>
        <div className="form-group">
          <input
            type="text"
            required
            placeholder="Ingrese el nombre de usuario"
          />
        </div>

        <div className="form-group">
          <input type="password" required placeholder="Ingrese su contraseña" />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Ingresar
        </button>
        <p>
          No tienes una cuenta?
          <a href="#">Registrese aquí</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
