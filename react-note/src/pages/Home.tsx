import { useCallback, useEffect, useState } from "react";
import Header from "../modules/Header";
import ListCard from "../modules/ListCard";
import Modal from "../modules/Modal";
import { useNavigate } from "react-router-dom";
import type { cardDataInterface } from "../modules/Card";
import Fetch from "../utils/api";

export default function Home() {
  const [currentView, setCurrentView] = useState("notes");
  const [modalVisible, setModalVisible] = useState(false);

  // Estado de la lista de notas
  // Y manejo de las mismas
  const [listCards, setListCards] = useState<cardDataInterface[]>([]);
  const navigate = useNavigate();

  const handleInvalidToken = useCallback(() => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }, [navigate]);

  const getNotes = useCallback(async (): Promise<cardDataInterface[]> => {
    try {
      const response = await Fetch({
        path: "notes/personal/",
        method: "GET",
      });

      if (response.ok) {
        const cards = await response.json();
        console.log("Cards: ", cards);
        setListCards(cards);
        return cards;
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
  }, [handleInvalidToken, setListCards]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const addNoteList = (newNote: cardDataInterface) => {
    setListCards((prevCards) => [newNote, ...prevCards]);
  };

  // Props para el modal
  const modalProps = {
    modalVisible: modalVisible,
    setModalVisible: setModalVisible,
    onNoteCreated: addNoteList,
  };

  const props = {
    currentView: currentView,
    setCurrentView: setCurrentView,
  };

  return (
    <>
      <Header {...props} />
      <main className="container">
        {currentView === "notes" ? (
          <>
            <div className="section-header">
              <h2>Mis notas</h2>
              <div className="auth-section">
                <button
                  onClick={() => setModalVisible(true)}
                  className="btn btn-primary"
                >
                  {" "}
                  +{" "}
                </button>

                <button className="btn btn-secondary">Notas compartidas</button>
              </div>
            </div>
            <ListCard listCards={listCards} />
          </>
        ) : (
          <p>Usuarios. No implementado todavia</p>
        )}

        {modalVisible && <Modal {...modalProps} />}
      </main>
    </>
  );
}
