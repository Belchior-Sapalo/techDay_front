import { toast, Bounce } from 'react-toastify';

export function notifyError(msg){
    toast.error(msg, {
      position: "top-center",
      closeButton: false,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      style: {whiteSpace: "nowrap"}
    });
}

export function notifySuccess(msg){
    toast.success(msg, {
      position: "top-center",
      closeButton: false,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      style: {whiteSpace: "nowrap"}
    });
  }

