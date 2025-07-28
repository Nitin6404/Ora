import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  onConfirm,
  loadingText = "Deleting...",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="z-[9999] bg-black/50">
      <DialogContent className="bg-white z-[9999]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? loadingText : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
