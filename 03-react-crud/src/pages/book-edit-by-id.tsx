import useSWR from "swr";
import { Author, Book } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import Loading from "../components/loading";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { notifyApiError } from "../lib/errors";

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: book, isLoading, error, mutate } = useSWR<Book>(`/books/${bookId}`);
  const { data: authors } = useSWR<Author[]>("/authors");

  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [formError, setFormError] = useState("");
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);
  const selectedAuthorId = authorId || (book ? String(book.author.id) : "");

  useEffect(() => {
    if (!isSetInitialValues && book) {
      setTitle(book.title);
      setAuthorId(String(book.author.id));
      setPublishedYear(book.publishedYear != null ? String(book.publishedYear) : "");
      setIsSetInitialValues(true);
    }
  }, [book, isSetInitialValues]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !selectedAuthorId) {
      setFormError("กรุณาระบุชื่อหนังสือและเลือกผู้แต่ง");
      return;
    }
    setFormError("");

    try {
      setIsProcessing(true);
      const response = await axios.patch<Book>(`/books/${bookId}`, {
        title: title.trim(),
        authorId: Number(selectedAuthorId),
        publishedYear: publishedYear === "" ? null : Number(publishedYear),
      });
      await mutate(response.data, { revalidate: false });
      toast.success("แก้ไขข้อมูลหนังสือสำเร็จ", {
        description: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
      notifyApiError(error, {
        notFound: { title: "ไม่พบข้อมูลหนังสือ", description: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข" },
        unprocessable: "ไม่พบข้อมูลผู้แต่งที่เลือก",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/books/${bookId}`);
      toast.success("ลบหนังสือสำเร็จ", {
        description: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
      });
      navigate("/books");
    } catch (error) {
      notifyApiError(error, {
        notFound: { title: "ไม่พบข้อมูลหนังสือ", description: "ไม่พบข้อมูลหนังสือที่ต้องการลบ" },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8 max-w-2xl px-4">
        <h1 className="text-xl font-bold">แก้ไขข้อมูลหนังสือ</h1>

        {isLoading && !error && <Loading />}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle />
            <div>
              <AlertTitle>เกิดข้อผิดพลาดในการอ่านข้อมูล</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </div>
          </Alert>
        )}

        {!!book && (
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
              <Select value={selectedAuthorId} onValueChange={setAuthorId}>
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

            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm">
                    <Trash2 />
                    ลบหนังสือนี้
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่</AlertDialogTitle>
                    <AlertDialogDescription>
                      เมื่อคุณดำเนินการลบหนังสือเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                    >
                      ลบ
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" disabled={isLoading || isProcessing}>
                {isProcessing ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
