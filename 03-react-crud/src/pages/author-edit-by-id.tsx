import useSWR from "swr";
import { Author } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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

export default function AuthorEditById() {
  const { authorId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: author, isLoading, error } = useSWR<Author>(`/authors/${authorId}`);

  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  useEffect(() => {
    if (!isSetInitialValues && author) {
      setName(author.name);
      setIsSetInitialValues(true);
    }
  }, [author, isSetInitialValues]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("กรุณาระบุชื่อผู้แต่ง");
      return;
    }
    setFormError("");

    try {
      setIsProcessing(true);
      await axios.patch(`/authors/${authorId}`, { name: name.trim() });
      toast.success("แก้ไขข้อมูลผู้แต่งสำเร็จ", {
        description: "ข้อมูลผู้แต่งได้รับการแก้ไขเรียบร้อยแล้ว",
      });
      navigate(`/authors/${authorId}`);
    } catch (error) {
      notifyApiError(error, {
        notFound: { title: "ไม่พบข้อมูลผู้แต่ง", description: "ไม่พบข้อมูลผู้แต่งที่ต้องการแก้ไข" },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/authors/${authorId}`);
      toast.success("ลบผู้แต่งสำเร็จ", {
        description: "ลบผู้แต่งคนนี้ออกจากระบบเรียบร้อยแล้ว",
      });
      navigate("/authors");
    } catch (error) {
      notifyApiError(error, {
        notFound: { title: "ไม่พบข้อมูลผู้แต่ง", description: "ไม่พบข้อมูลผู้แต่งที่ต้องการลบ" },
        conflict: "ลบหนังสือของผู้แต่งคนนี้ก่อนจึงจะลบผู้แต่งได้",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8 max-w-2xl px-4">
        <h1 className="text-xl font-bold">แก้ไขข้อมูลผู้แต่ง</h1>

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

        {!!author && (
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

            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm">
                    <Trash2 />
                    ลบผู้แต่งคนนี้
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>คุณต้องการลบผู้แต่งคนนี้ใช่หรือไม่</AlertDialogTitle>
                    <AlertDialogDescription>
                      เมื่อคุณดำเนินการลบผู้แต่งคนนี้แล้ว จะไม่สามารถย้อนกลับได้
                      ผู้แต่งที่ยังมีหนังสือในระบบจะไม่สามารถลบได้
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
