type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
  };
  
  export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Tem certeza?",
    message = "Você está prestes a excluir este item.",
  }: Props) {
    if (!isOpen) return null; 
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-sm ">
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <p className="text-sm mb-4">{message}</p>
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
  