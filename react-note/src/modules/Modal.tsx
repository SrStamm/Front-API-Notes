import type React from "react";
import { useEffect, useState } from "react";
import Fetch from "../utils/api";
import type { cardDataInterface } from "./Card";

type ModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onNoteCreated: (note: cardDataInterface) => void;
  onNoteUpdated: (note: cardDataInterface) => void;
  noteToEdit: cardDataInterface | null;
};

type NewNote = {
  id?: number;
  text: string;
  tags: string[];
  category: string;
};

function Modal({
  modalVisible,
  setModalVisible,
  onNoteCreated,
  onNoteUpdated,
  noteToEdit,
}: ModalProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (noteToEdit) {
      setText(noteToEdit.text);
      setCategory(noteToEdit.category);
      setTags(noteToEdit.tag || "");
    } else {
      setText("");
      setCategory("");
      setTags("");
    }
  }, [noteToEdit]);

  const textChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const categoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const tagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const NoteData: NewNote = {
      text: text,
      category: category,
      tags: tagsArray,
    };

    const mode = noteToEdit ? "EDIT" : "CREATE";

    const path = mode === "CREATE" ? "notes/" : `notes/${noteToEdit?.id}`;
    const method = mode === "CREATE" ? "POST" : "PATCH";

    try {
      const response = await Fetch({
        path: path,
        method: method,
        body: NoteData,
      });

      if (response.ok) {
        const responseData = await response.json();

        console.log(responseData);

        if (mode === "CREATE") {
          onNoteCreated(responseData.new_note); // Notifica la creación
        } else {
          onNoteUpdated(responseData.updated_note); // Notifica la actualización
        }

        setModalVisible(false);
      } else {
        console.error("Error al crear la nota");
        const responseError = await response.json();
        throw new Error(responseError.detail);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div
      className={
        modalVisible === true ? "modal-backdrop show" : "modal-backdrop"
      }
    >
      <div className="form-container modal">
        <div className="modal-header">
          <button
            onClick={() => setModalVisible(false)}
            className="modal-close"
          >
            X
          </button>
          <h2 className="form-title">Nueva nota</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              onChange={textChange}
              value={text}
              rows={5}
              required
              placeholder="Escriba el texto de la nota..."
            ></textarea>
          </div>
          <div className="form-group">
            <select onChange={categoryChange} value={category} required>
              <option value="" disabled>
                Seleccione una categoría
              </option>
              <option value="work">Trabajo</option>
              <option value="study">Estudio</option>
              <option value="unknown">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <input
              onChange={tagsChange}
              type="text"
              placeholder="Escriba los tags separados por coma (importante, proyecto)"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button
              onClick={() => setModalVisible(false)}
              type="button"
              className="btn btn-warning"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
