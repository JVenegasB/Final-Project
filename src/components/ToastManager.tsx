import React from "react";
import {
  Toaster,
  useId,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
} from "@fluentui/react-components";

// Props del componente para personalizar el toast
interface ToastProps {
  title: string;
  description: string;
  intent?: "success" | "error" | "warning" | "info";
}

// Componente principal de Toast
const ToastComponent: React.FC = () => {
  const toasterId = useId("toaster"); // ID único para el Toaster
  const { dispatchToast } = useToastController(toasterId); // Controlador de Toast

  // Función para mostrar un toast
  const showToast = ({ title, description, intent = "success" }: ToastProps) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        <ToastBody>{description}</ToastBody>
      </Toast>,
      { intent }
    );
  };

  return { toasterId, showToast };
};

export default ToastComponent;
