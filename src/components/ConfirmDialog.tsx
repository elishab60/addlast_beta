"use client";

import { ReactNode, type MouseEvent } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: React.ComponentProps<typeof Button>["variant"];
    onConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
    confirmLoading?: boolean;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    confirmVariant = "destructive",
    onConfirm,
    confirmLoading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={confirmLoading}>
                            {cancelLabel}
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant={confirmVariant}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onConfirm(event);
                        }}
                        disabled={confirmLoading}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
