// components/UserListModal.tsx
type Props = {
    title: string;
    userList: { id: number; name: string }[];
    onClose: () => void;
  };
  
  export function UserListModal({ title, userList, onClose }: Props) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
          <ul className="divide-y text-sm text-gray-700 max-h-60 overflow-y-auto">
            {userList.length === 0 ? (
              <p className="text-gray-400">Nenhum usuário encontrado.</p>
            ) : (
              userList.map((u) => (
                <li key={u.id} className="py-2">
                  {u.name}
                </li>
              ))
            )}
          </ul>
          <button
            className="mt-4 w-full bg-gray-200 py-2 rounded-xl text-sm"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }
  