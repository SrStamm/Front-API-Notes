function RegisterForm() {
  return (
    <div className="form-container">
      <h2 className="form-title">Registrarse</h2>
      <form>
        <div className="form-group">
          <input
            type="text"
            required
            placeholder="Ingrese un nombre de usuario"
          />
        </div>
        <div className="form-group">
          <input type="email" required placeholder="Ingrese un email" />
        </div>

        <div className="form-group">
          <input
            type="password"
            required
            placeholder="Ingrese una contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
        <p>
          Ya tienes una cuenta?
          <a href="#">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
