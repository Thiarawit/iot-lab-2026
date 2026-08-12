import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full my-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />

      <div className="text-xs text-neutral-500">กำลังโหลด...</div>
    </div>
  );
}
