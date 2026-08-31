import { useContext } from "react";
import ToastContext from "../context/toast-context";

function useToast() {
  return useContext(ToastContext);
}

export default useToast;