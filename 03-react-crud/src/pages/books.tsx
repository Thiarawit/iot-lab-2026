import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Book } from "../lib/models";
import Loading from "../components/loading";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function BooksPage() {
  const { data: books, error } = useSWR<Book[]>("/books");

  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl font-bold mb-2">หนังสือ</h1>
        <h2 className="text-xl">รายการหนังสือทั้งหมด</h2>
      </section>

      <section className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">รายการหนังสือ</h1>

          <Button asChild size="sm">
            <Link to="/books/create">
              <Plus />
              เพิ่มหนังสือ
            </Link>
          </Button>
        </div>

        {!books && !error && <Loading />}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle />
            <div>
              <AlertTitle>เกิดข้อผิดพลาดในการอ่านข้อมูล</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books?.map((book) => (
            <div className="border border-solid border-neutral-200 rounded-lg overflow-hidden" key={book.id}>
              <img
                src="https://placehold.co/150x200"
                alt={book.title}
                className="w-full object-cover aspect-[3/4]"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold line-clamp-2">{book.title}</h2>
                <p className="text-xs text-neutral-500">โดย {book.author.name}</p>
              </div>

              <div className="flex justify-end px-4 pb-2">
                <Button asChild variant="outline" size="xs">
                  <Link to={`/books/${book.id}`}>ดูรายละเอียด</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
