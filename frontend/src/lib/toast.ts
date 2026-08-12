import { toast } from 'sonner';

export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 3500,
    });
  },
  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 4500,
    });
  },
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3500,
    });
  },
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  },
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
  promise: <T>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => {
    return toast.promise(promise, data);
  },
};

export { toast };
