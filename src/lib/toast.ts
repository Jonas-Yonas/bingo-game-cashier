import { toast } from "sonner";

export function showToast(
  message: string,
  type: "success" | "error" = "success"
) {
  if (type === "error") {
    toast.error(message);
  } else {
    toast.success(message);
  }
}
