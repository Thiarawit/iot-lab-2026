import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { Book } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { AlertTriangle, Pencil } from "lucide-react";

export default function BookByIdPage() {
  const { bookId } = useParams();

  const { data: book, isLoading, error } = useSWR<Book>(`/books/${bookId}`);

  return (
    <Layout>
      <div className="container mx-auto mt-4 px-4">
        {isLoading && !error && <Loading />}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle />
            <div>
              <AlertTitle>เกิดข้อผิดพลาดในการอ่านข้อมูล</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </div>
          </Alert>
        )}

        {!!book && (
          <>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="italic text-neutral-500 mb-4">
              โดย {book.author.name}
              {book.publishedYear != null && ` · พิมพ์เมื่อปี ${book.publishedYear}`}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <img
                src="https://placehold.co/150x200"
                alt={book.title}
                className="w-full object-cover aspect-[3/4]"
              />
              <div className="col-span-2 px-4 space-y-2 py-4">
                <h3 className="text-lg font-semibold">รายละเอียดหนังสือ</h3>
                <p className="indent-4">
                  {/* TODO: เพิ่มรายละเอียดหนังสือ */}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, neque.
                  Necessitatibus nihil quibusdam molestiae, asperiores nesciunt quod aliquid
                  accusamus iusto sint amet optio laudantium eius, facilis iure ipsa assumenda
                  alias pariatur! Quis ad ratione amet fugiat, et culpa cupiditate, veritatis
                  beatae sed voluptatum a reprehenderit id odit quas? Enim, earum?
                </p>

                <h3 className="text-lg font-semibold">เรื่องย่อ</h3>
                <p className="indent-4">
                  {/* TODO: เพิ่มเรื่องย่อ */}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia officiis amet nemo
                  ut placeat aliquam neque id voluptates quod nihil.
                </p>

                <h3 className="text-lg font-semibold">หมวดหมู่</h3>
                {/* TODO: เพิ่มหมวดหมู่(s) */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="teal">#หมวดหมู่ 1</Badge>
                  <Badge variant="teal">#หมวดหมู่ 2</Badge>
                  <Badge variant="teal">#หมวดหมู่ 3</Badge>
                  <Badge variant="teal">#หมวดหมู่ 4</Badge>
                </div>
              </div>
            </div>

            <hr className="mt-4 border-neutral-200" />

            <Button asChild className="mt-4" size="sm">
              <Link to={`/books/${book.id}/edit`}>
                <Pencil />
                แก้ไขข้อมูลหนังสือ
              </Link>
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}
