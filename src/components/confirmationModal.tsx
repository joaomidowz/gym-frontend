type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };
  
  export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
  }: Props) {
    if (!isOpen) return null; 
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-sm w-full">
          <h2 className="text-lg font-bold mb-4">Tem certeza?</h2>
          <p className="text-sm mb-4">Você está prestes a excluir esta sessão.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-xl text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm"
            >
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    );
  }
  