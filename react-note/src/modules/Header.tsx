function Header() {
  return (
    <header className="header">
      <nav className="nav container">
        <h1>Gestor de Notas</h1>
        <div className="auth-section">
          
          <button className="btn btn-primary"> Mis notas </button>
          
          <button className="btn btn-secondary">Usuarios</button>
          <button className="btn btn-success">Mi perfil</button>
          <button className="btn btn-danger">Cerrar Sesión</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
