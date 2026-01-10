import { ReactNode } from 'react';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: AlertDialogProps) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        data-state={open ? 'open' : 'closed'}
        onClick={handleCancel}
      />
      
      {/* Dialog */}
      <div
        role="alertdialog"
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        data-state={open ? 'open' : 'closed'}
        data-slot="alert-dialog-content"
        className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg bg-[#1a1a1a] border-[#2a2a2a]"
        tabIndex={-1}
        style={{ pointerEvents: 'auto' }}
      >
        <div data-slot="alert-dialog-header" className="flex flex-col gap-2 text-center sm:text-left">
          <h2
            id="alert-dialog-title"
            data-slot="alert-dialog-title"
            className="text-lg font-semibold text-white"
          >
            {title}
          </h2>
          <p
            id="alert-dialog-description"
            data-slot="alert-dialog-description"
            className="text-muted-foreground text-sm text-gray-400"
          >
            {description}
          </p>
        </div>
        <div data-slot="alert-dialog-footer" className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-[#1f1f1f] border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-[#FF6D00] text-white hover:bg-[#e56300]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};
