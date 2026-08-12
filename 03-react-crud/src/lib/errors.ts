import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorMessages {
  /** 404 — resource missing */
  notFound?: { title: string; description: string };
  /** 400 — schema validation failed */
  invalid?: string;
  /** 422 — semantic rejection, e.g. dangling authorId */
  unprocessable?: string;
  /** 409 — conflict, e.g. author still has books */
  conflict?: string;
}

export function notifyApiError(error: unknown, messages: ApiErrorMessages = {}) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 404 && messages.notFound) {
      toast.error(messages.notFound.title, { description: messages.notFound.description });
    } else if (status === 400) {
      toast.error("ข้อมูลไม่ถูกต้อง", {
        description: messages.invalid ?? "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
      });
    } else if (status === 422) {
      toast.error("ข้อมูลไม่ถูกต้อง", {
        description: messages.unprocessable ?? "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
      });
    } else if (status === 409) {
      toast.error("ไม่สามารถดำเนินการได้", {
        description: messages.conflict ?? "ข้อมูลนี้ถูกใช้งานอยู่",
      });
    } else {
      toast.error("เกิดข้อผิดพลาดบางอย่าง", { description: "กรุณาลองใหม่อีกครั้ง" });
    }
  } else {
    toast.error("เกิดข้อผิดพลาดบางอย่าง", {
      description: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
    });
  }
}
