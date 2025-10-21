import { useState } from "react";
import Header from "../modules/Header";
import ListCard from "../modules/ListCard";
import Modal from "../modules/Modal";

const data = [
  {
    text: "Esto es una nota",
    category: "category",
    tag: "tag",
    date: "12/12",
  },

  {
    text: "Hola mundo",
    category: "category",
    tag: "tag",
    date: "19/9",
  },
];

export default function Home() {
  const [currentView, setCurrentView] = useState("notes");

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
                <button className="btn btn-primary"> + </button>

                <button className="btn btn-secondary">Notas compartidas</button>
              </div>
            </div>
            <ListCard data={data} />
          </>
        ) : (
          <p>Usuarios. No implementado todavia</p>
        )}

        <Modal />
      </main>
    </>
  );
}
