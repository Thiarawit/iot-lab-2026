import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { Author, Book } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { AlertTriangle, Pencil } from "lucide-react";

export default function AuthorByIdPage() {
  const { authorId } = useParams();

  const { data: author, isLoading, error } = useSWR<Author>(`/authors/${authorId}`);
  const { data: books } = useSWR<Book[]>("/books");

  const authorBooks = books?.filter((book) => book.author.id === Number(authorId));

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

        {!!author && (
          <>
            <h1 className="text-2xl font-bold">{author.name}</h1>
            <p className="italic text-neutral-500 mb-4">ผู้แต่ง</p>

            <hr className="border-neutral-200" />

            <h3 className="text-lg font-semibold mt-4">หนังสือของผู้แต่งคนนี้</h3>
            {authorBooks && authorBooks.length === 0 && (
              <p className="text-sm text-neutral-500 mt-2">ยังไม่มีหนังสือในระบบ</p>
            )}
            <ul className="list-disc list-inside mt-2 space-y-1">
              {authorBooks?.map((book) => (
                <li key={book.id}>
                  <Link to={`/books/${book.id}`} className="text-primary hover:underline">
                    {book.title}
                  </Link>
                  {book.publishedYear != null && (
                    <span className="text-xs text-neutral-500"> ({book.publishedYear})</span>
                  )}
                </li>
              ))}
            </ul>

            <hr className="mt-4 border-neutral-200" />

            <Button asChild className="mt-4" size="sm">
              <Link to={`/authors/${author.id}/edit`}>
                <Pencil />
                แก้ไขข้อมูลผู้แต่ง
              </Link>
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}
