type Props = {
  currentView: string;
  setCurrentView: (view: string) => void;
};

function Header({ currentView, setCurrentView }: Props) {
  return (
    <header className="header">
      <nav className="nav container">
        <h1>Gestor de Notas</h1>
        <div className="auth-section">
          {currentView === "notes" ? (
            <button
              onClick={() => setCurrentView("users")}
              className="btn btn-secondary"
            >
              Usuarios{" "}
            </button>
          ) : (
            <button
              onClick={() => setCurrentView("notes")}
              className="btn btn-primary"
            >
              Mis notas{" "}
            </button>
          )}
          <button className="btn btn-success">Mi perfil</button>
          <button className="btn btn-danger">Cerrar Sesión</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
