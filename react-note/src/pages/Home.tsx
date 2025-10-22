import { useState } from "react";
import Header from "../modules/Header";
import ListCard from "../modules/ListCard";
import Modal from "../modules/Modal";

export default function Home() {
  const [currentView, setCurrentView] = useState("notes");

  const [modalVisible, setModalVisible] = useState(false);

  const modalProps = {
    modalVisible: modalVisible,
    setModalVisible: setModalVisible,
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
            <ListCard />
          </>
        ) : (
          <p>Usuarios. No implementado todavia</p>
        )}

        {modalVisible && <Modal {...modalProps} />}
      </main>
    </>
  );
}
