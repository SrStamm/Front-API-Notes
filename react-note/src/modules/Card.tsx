export interface cardDataInterface {
  id: number;
  text: string;
  category: string;
  tag: string;
  date: string;
}

export interface sharedDataInterface {
    note_id: number,
    text: string,
    category: string,
    original_user_id: number
}

interface CardProps {
  data: cardDataInterface;
  onDeleteNote: (noteId: number) => void;
  onEditNote: (editCard: cardDataInterface) => void;
  onShareNote: (noteId: number) => void;
}

function Card({ data, onDeleteNote, onEditNote, onShareNote }: CardProps) {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="badge" id="noteCategoryBadge">
            {data.category}
          </span>
          <span className="badge" id="noteOriginalUserID"></span>
          <small className="text-muted note-date">{data.date}</small>
        </div>
        <p className="note-text">{data.text}</p>
        <div className="tags" id="noteTagsContainer">
          {data.tag}
        </div>
        <div className="card-actions">
          <button
            onClick={() => onEditNote(data)}
            type="button"
            className="btn btn-primary editBtn"
          >
            Editar
          </button>
          <button
            onClick={() => onDeleteNote(data.id)}
            type="button"
            className="btn btn-danger deleteBtn"
          >
            Eliminar
          </button>
          <button
            onClick={() => onShareNote(data.id)}
            type="button"
            className="btn btn-success shareBtn"
          >
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
