export interface userDataInterface {
  user_id: number;
  username: string;
}

interface ListUsersProps {
  listUser: userDataInterface[];
  toShare: boolean;
  onShareUser: (userId: number ) => void;
}

function TableUser({ listUser, toShare, onShareUser}: ListUsersProps) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            {toShare && <th>Acción</th>}
          </tr>
        </thead>

        <tbody>
          {listUser.map((user) =>
            toShare === true ? (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => onShareUser(user.user_id)}
                    className="btn btn-warning"
                  >
                    Compartir
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableUser;
