"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useI18n } from "./i18n-provider";

interface ErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ErrorModal({ open, onOpenChange }: ErrorModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-red-100 dark:bg-red-950 p-2">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-lg sm:text-xl text-red-600 dark:text-red-400">
              {t("result.invalidImageTitle")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base leading-relaxed pt-2">
            {t("result.invalidImageDesc")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t("result.invalidImageButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
