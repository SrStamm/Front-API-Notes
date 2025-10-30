import { useCallback, useEffect, useState } from "react";
import Fetch from "../utils/api";
import { useNavigate } from "react-router-dom";

interface sessionData {
  session_id: string;
  is_active: boolean;
  user_id: number;
}

interface userDataInterface {
  username: string;
}

function UserInfo() {
  const navigate = useNavigate();

  const handleInvalidToken = useCallback(() => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }, [navigate]);

  const [currentInfo, setCurrentInfo] = useState<sessionData[]>([]);
  const [currentUser, setCurrentUser] = useState<userDataInterface>({
    username: "",
  });

  const getSession = useCallback(async (): Promise<sessionData[]> => {
    try {
      const response = await Fetch({
        path: "sessions",
        method: "GET",
      });

      if (response.ok) {
        const sessions = await response.json();
        setCurrentInfo(sessions);
        return sessions;
      } else if (response.status === 401) {
        handleInvalidToken();
        return [];
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      console.error("Error: ", error);
      return [];
    }
  }, [handleInvalidToken, setCurrentInfo]);

  const getCurrentUserInfo =
    useCallback(async (): Promise<userDataInterface> => {
      try {
        const response = await Fetch({
          path: "users/me",
          method: "GET",
        });

        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          return user;
        } else if (response.status === 401) {
          handleInvalidToken();
          return { username: "" };
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        }
      } catch (error) {
        console.error("Error: ", error);
        return { username: "" };
      }
    }, [handleInvalidToken, setCurrentUser]);

  useEffect(() => {
    getSession();
    getCurrentUserInfo();
  }, [getSession, getCurrentUserInfo]);

  const deactivateAllSession = async () => {
    try {
      const response = await Fetch({
        path: "sessions/all-sessions",
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Cerradas todas las sesiones");
        handleInvalidToken();
        return;
      } else if (response.status === 401) {
        handleInvalidToken();
        return;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      console.error("Error al cerrar las sesiones: ", error);
    }
  };

  const deactivateSession = async (sessionId: string) => {
    try {
      const response = await Fetch({
        path: `sessions/${sessionId}`,
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Cerrada la sesión ${sessionId}`);
        handleInvalidToken();
        return;
      } else if (response.status === 401) {
        handleInvalidToken();
        return;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      console.error("Error al cerrar la sesión: ", error);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1>Perfil</h1>
      </div>
      <div className="">
        {currentUser ? (
          <h2>Nombre: {currentUser.username}</h2>
        ) : (
          <p>Cargando información del usuario...</p>
        )}
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {currentInfo.map((session) => (
              <tr key={session.session_id}>
                <td>{session.session_id}</td>
                {session.is_active === true ? (
                  <>
                    <td style={{ color: "green" }}>Activo </td>

                    <td>
                      <button
                        onClick={() => deactivateSession(session.session_id)}
                        className="btn btn-warning"
                      >
                        Cerrar sesión
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ color: "red" }}>Inactivo </td>
                    <td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={() => deactivateAllSession()}
          className="btn btn-danger"
        >
          Cerrrar todas las sesiones
        </button>
      </div>
    </section>
  );
}

export default UserInfo;
