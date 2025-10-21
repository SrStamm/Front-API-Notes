function Modal() {
  return (
    <div className="modal-backdrop ">
      <div className="form-container modal">
        <div className="modal-header">
          <button className="modal-close">X</button>
          <h2 className="form-title">Nueva nota</h2>
        </div>
        <form className="form">
          <div className="form-group">
            <textarea
              rows={5}
              required
              placeholder="Escriba el texto de la nota..."
            ></textarea>
          </div>
          <div className="form-group">
            <select required>
              <option value="" disabled selected>
                Seleccione una categoría
              </option>
              <option value="work">Trabajo</option>
              <option value="study">Estudio</option>
              <option value="unknown">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Escriba los tags separados por coma (importante, proyecto)"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-primary">
              Guardar
            </button>
            <button type="button" className="btn btn-warning">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
