"use client";
import { Dialog } from "@/components/ui/dialog";
import { useState, createContext, useContext } from "react";
import { AddToCartModal } from "@/modules/products/components/AddToCart";
import { RemoveFromCartModal } from "@/modules/cart/components/RemoveFromCartModal";

interface ModalType {
  type: "ATC" | "RFC" | "custom";
  // This item is used in the "ATC" type modal and will be passed as a prop
  productname: string;
  productId: string;
}

const ModalContext = createContext<{
  modal: ModalType | null;
  showModal: (modal: ModalType) => void;
  hideModal: () => void;
} | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modal, setModal] = useState<ModalType | null>(null);

  const showModal = (modal: ModalType) => setModal(modal);
  const hideModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
      {modal && (
        <Dialog open={!!modal} onOpenChange={hideModal}>
          {modal.type === "ATC" && (
            <AddToCartModal
              productname={modal.productname}
              productId={modal.productId}
            />
          )}
          {modal.type === "RFC" && (
            <RemoveFromCartModal
              productname={modal.productname}
              productId={modal.productId}
            />
          )}
          {modal.type === "custom" && <div>Custom Modal Content</div>}
        </Dialog>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
