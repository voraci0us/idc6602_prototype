import * as Dialog from "@radix-ui/react-dialog";

export function DialogContent({ children }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Content className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          {children}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

