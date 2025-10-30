import { useNavigate } from "react-router-dom";

type Props = {
  currentView: string;
  setCurrentView: (view: string) => void;
};

function Header({ currentView, setCurrentView }: Props) {
  const navigate = useNavigate();

  const closeSession = async () => {
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch("http://100.110.201.56:8000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok || response.status === 401) {
        localStorage.removeItem("auth_token");
        console.log("Has cerrado sesión con éxito");

        navigate("/login");
      } else {
        const dataError = await response.json();
        console.log("Error:", dataError.detail);
      }
    } catch (error) {
      console.error("Error al intentar conectar con el servidor:", error);
    }
  };

  return (
    <header className="header">
      <nav className="nav container">
        <h1>Gestor de Notas</h1>
        <div className="auth-section">
          {currentView === "notes" ? (
            <>
              <button
                onClick={() => setCurrentView("users")}
                className="btn btn-secondary"
              >
                Usuarios
              </button>

              <button
                onClick={() => setCurrentView("perfil")}
                className="btn btn-success"
              >
                Mi perfil
              </button>
            </>
          ) : currentView === "users" ? (
            <>
              <button
                onClick={() => setCurrentView("notes")}
                className="btn btn-primary"
              >
                Mis notas
              </button>

              <button
                onClick={() => setCurrentView("perfil")}
                className="btn btn-success"
              >
                Mi perfil
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentView("notes")}
                className="btn btn-primary"
              >
                Mis notas
              </button>

              <button
                onClick={() => setCurrentView("users")}
                className="btn btn-secondary"
              >
                Usuarios
              </button>
            </>
          )}
          <button onClick={closeSession} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
