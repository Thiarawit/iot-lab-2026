import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Author } from "../lib/models";
import { notifyApiError } from "../lib/errors";

export default function AuthorCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("กรุณาระบุชื่อผู้แต่ง");
      return;
    }
    setFormError("");

    try {
      setIsProcessing(true);
      const response = await axios.post<Author>(`/authors`, { name: name.trim() });
      toast.success("เพิ่มข้อมูลผู้แต่งสำเร็จ", {
        description: "ข้อมูลผู้แต่งได้รับการเพิ่มเรียบร้อยแล้ว",
      });
      navigate(`/authors/${response.data.id}`);
    } catch (error) {
      notifyApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8 max-w-2xl px-4">
        <h1 className="text-xl font-bold">เพิ่มผู้แต่งในระบบ</h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อผู้แต่ง</Label>
            <Input
              id="name"
              placeholder="ชื่อผู้แต่ง"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <hr className="border-neutral-200" />

          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
