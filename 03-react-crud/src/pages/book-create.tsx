import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Author, Book } from "../lib/models";
import { notifyApiError } from "../lib/errors";
import useSWR from "swr";

export default function BookCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: authors } = useSWR<Author[]>("/authors");

  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !authorId) {
      setFormError("กรุณาระบุชื่อหนังสือและเลือกผู้แต่ง");
      return;
    }
    setFormError("");

    try {
      setIsProcessing(true);
      const response = await axios.post<Book>(`/books`, {
        title: title.trim(),
        authorId: Number(authorId),
        ...(publishedYear !== "" && { publishedYear: Number(publishedYear) }),
      });
      toast.success("เพิ่มข้อมูลหนังสือสำเร็จ", {
        description: "ข้อมูลหนังสือได้รับการเพิ่มเรียบร้อยแล้ว",
      });
      navigate(`/books/${response.data.id}`);
    } catch (error) {
      notifyApiError(error, { unprocessable: "ไม่พบข้อมูลผู้แต่งที่เลือก" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8 max-w-2xl px-4">
        <h1 className="text-xl font-bold">เพิ่มหนังสือในระบบ</h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อหนังสือ</Label>
            <Input
              id="title"
              placeholder="ชื่อหนังสือ"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>ผู้แต่ง</Label>
            <Select value={authorId} onValueChange={setAuthorId}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกผู้แต่ง" />
              </SelectTrigger>
              <SelectContent>
                {authors?.map((author) => (
                  <SelectItem key={author.id} value={String(author.id)}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedYear">ปีที่พิมพ์ (ค.ศ.)</Label>
            <Input
              id="publishedYear"
              type="number"
              min={0}
              step={1}
              placeholder="ปีที่พิมพ์"
              value={publishedYear}
              onChange={(event) => setPublishedYear(event.target.value)}
            />
          </div>

          {/* TODO: เพิ่มรายละเอียดหนังสือ */}
          {/* TODO: เพิ่มเรื่องย่อ */}
          {/* TODO: เพิ่มหมวดหมู่(s) */}

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
