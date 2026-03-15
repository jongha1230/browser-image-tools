"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  createUploadFileId,
  getSupportedImageLabel,
  validateImageFiles,
} from "@/lib/image-upload";

export type UploadSource = "drop" | "input" | "paste";

export type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  typeLabel: string;
};

type UploadMessage = {
  id: string;
  message: string;
};

type ImageUploadContextValue = {
  errors: UploadMessage[];
  items: UploadedImage[];
  lastSource: UploadSource | null;
  addFiles: (files: Iterable<File> | ArrayLike<File> | null | undefined, source: UploadSource) => void;
  clearErrors: () => void;
  clearItems: () => void;
  removeItem: (id: string) => void;
};

const ImageUploadContext = createContext<ImageUploadContextValue | null>(null);

function createMessageId(index: number) {
  return `upload-message-${index}`;
}

export function ImageUploadProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<UploadMessage[]>([]);
  const [lastSource, setLastSource] = useState<UploadSource | null>(null);
  const itemsRef = useRef<UploadedImage[]>([]);
  const messageCountRef = useRef(0);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, []);

  function pushErrors(messages: string[]) {
    if (messages.length === 0) {
      return;
    }

    setErrors((current) => {
      const nextMessages = messages.map((message) => {
        messageCountRef.current += 1;

        return {
          id: createMessageId(messageCountRef.current),
          message,
        };
      });

      return [...nextMessages, ...current].slice(0, 8);
    });
  }

  function addFiles(
    files: Iterable<File> | ArrayLike<File> | null | undefined,
    source: UploadSource,
  ) {
    const incomingFiles = files ? Array.from(files) : [];

    if (incomingFiles.length === 0) {
      if (source === "paste") {
        pushErrors([
          "클립보드에 JPEG, PNG, WebP 이미지가 없어 붙여넣기할 수 없습니다.",
        ]);
      }
      return;
    }

    const validation = validateImageFiles(
      incomingFiles,
      itemsRef.current.map((item) => item.file),
    );
    const acceptedItems = validation.accepted.map((file) => ({
      id: createUploadFileId(file),
      file,
      previewUrl: URL.createObjectURL(file),
      typeLabel: getSupportedImageLabel(file),
    }));

    if (acceptedItems.length > 0) {
      const nextItems = [...itemsRef.current, ...acceptedItems];

      itemsRef.current = nextItems;
      setItems(nextItems);
      setLastSource(source);
    }

    pushErrors(validation.rejected.map((issue) => issue.message));
  }

  function removeItem(id: string) {
    const targetItem = itemsRef.current.find((item) => item.id === id);

    if (!targetItem) {
      return;
    }

    URL.revokeObjectURL(targetItem.previewUrl);

    const nextItems = itemsRef.current.filter((item) => item.id !== id);

    itemsRef.current = nextItems;
    setItems(nextItems);

    if (nextItems.length === 0) {
      setLastSource(null);
    }
  }

  function clearItems() {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.previewUrl);
    }

    itemsRef.current = [];
    setItems([]);
    setLastSource(null);
  }

  function clearErrors() {
    setErrors([]);
  }

  return (
    <ImageUploadContext.Provider
      value={{
        errors,
        items,
        lastSource,
        addFiles,
        clearErrors,
        clearItems,
        removeItem,
      }}
    >
      {children}
    </ImageUploadContext.Provider>
  );
}

export function useImageUploads() {
  const context = useContext(ImageUploadContext);

  if (!context) {
    throw new Error("useImageUploads must be used within ImageUploadProvider");
  }

  return context;
}
