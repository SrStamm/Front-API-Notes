import { useCallback, useEffect, useState } from "react";
import Header from "../modules/Header";
import ListCard from "../modules/ListCard";
import Modal from "../modules/Modal";
import { useNavigate } from "react-router-dom";
import type { cardDataInterface } from "../modules/Card";
import {
  fetchDeletePersonalNote,
  fetchPersonalNotes,
  fetchSharedNotes,
} from "../services/notesService";
import { type userDataInterface } from "../modules/TableUsers";
import TableUser from "../modules/TableUsers";
import Fetch from "../utils/api";

export default function Home() {
  const navigate = useNavigate();

  const handleInvalidToken = useCallback(() => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }, [navigate]);

  const [currentView, setCurrentView] = useState("notes");
  const [typeNotes, setTypeNotes] = useState("personal");
  const [modalVisible, setModalVisible] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<cardDataInterface | null>(null);

  // Estado de la lista de notas
  // Y manejo de las mismas
  const [listCards, setListCards] = useState<cardDataInterface[]>([]);

  //
  //
  // Personal notes
  //
  //

  const getNotes = useCallback(async (): Promise<cardDataInterface[]> => {
    try {
      const response = await fetchPersonalNotes();

      if (response.ok) {
        const cards = await response.json();
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
    setListCards((prevCards) => [...prevCards, newNote]);
  };

  const deleteNoteHandler = async (noteId: number) => {
    try {
      const response = await fetchDeletePersonalNote(noteId);

      if (response.ok) {
        setListCards((prevCards) =>
          prevCards.filter((card) => card.id !== noteId),
        );
      } else if (response.status === 401) {
        handleInvalidToken();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      console.error("Fallo al eliminar la nota:", error);
    }
  };

  const handleEditRequest = (note: cardDataInterface) => {
    setNoteToEdit(note);
    setModalVisible(true);
  };

  const updateNoteList = (updateNote: cardDataInterface) => {
    setListCards((prevCards) =>
      prevCards.map((card) => (card.id === updateNote.id ? updateNote : card)),
    );
  };

  // Props para el modal
  const modalProps = {
    modalVisible: modalVisible,
    setModalVisible: setModalVisible,
    onNoteCreated: addNoteList,
    onNoteUpdated: updateNoteList,
    noteToEdit: noteToEdit,
  };

  const props = {
    currentView: currentView,
    setCurrentView: setCurrentView,
  };

  //
  //
  // Shared Notes
  //
  //

  const [listSharedNotes, setListSharedNotes] = useState<cardDataInterface[]>(
    [],
  );

  const getSharedNotes = useCallback(async (): Promise<cardDataInterface[]> => {
    try {
      const response = await fetchSharedNotes();

      if (response.ok) {
        const notes = await response.json();
        setListSharedNotes(notes);
        return notes;
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
  }, [handleInvalidToken, setListSharedNotes]);

  //
  //
  //
  //

  const renderNotes =
    typeNotes === "personal" ? (
      <>
        <div className="section-header">
          <h2>Mis notas</h2>
          <div className="auth-section">
            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary"
            >
              +
            </button>

            <button
              onClick={() => setTypeNotes("shared")}
              className="btn btn-secondary"
            >
              Notas compartidas
            </button>
          </div>
        </div>
        <ListCard
          listCards={listCards}
          onDeleteNote={deleteNoteHandler}
          onEditNote={handleEditRequest}
        />
      </>
    ) : (
      <>
        <div className="section-header">
          <h2>Notas compartidas</h2>
          <div className="auth-section">
            <button
              onClick={() => setTypeNotes("personal")}
              className="btn btn-secondary"
            >
              Mis Notas
            </button>
          </div>
        </div>

        {listSharedNotes.length > 0 ? (
          <ListCard
            listCards={listSharedNotes}
            onDeleteNote={deleteNoteHandler}
            onEditNote={handleEditRequest}
          />
        ) : (
          <h3>Nadie compartió notas contigo</h3>
        )}
      </>
    );

  //
  //
  // Users
  //
  //

  const [listUsers, setListUsers] = useState<userDataInterface[]>([]);

  const getUsers = useCallback(async (): Promise<userDataInterface[]> => {
    try {
      const response = await Fetch({
        path: "users/all-users/",
        method: "GET",
      });

      if (response.ok) {
        const users = await response.json();
        setListUsers(users);
        return users;
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
  }, [handleInvalidToken, setListUsers]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Header {...props} />
      <main className="container">
        {currentView === "notes" ? (
          renderNotes
        ) : (
          <TableUser listUser={listUsers} />
        )}

        {modalVisible && <Modal {...modalProps} />}
      </main>
    </>
  );
}
