export interface userDataInterface {
  user_id: number;
  username: string;
}

interface ListUsersProps {
  listUser: userDataInterface[];
}

function TableUser({ listUser }: ListUsersProps) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>

        <tbody>
          {listUser.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableUser;
