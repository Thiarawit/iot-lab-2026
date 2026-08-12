import Layout from "../components/layout";
import useSWR from "swr";
import { Author } from "../lib/models";
import Loading from "../components/loading";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { AlertTriangle, Plus, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthorsPage() {
  const { data: authors, error } = useSWR<Author[]>("/authors");

  return (
    <Layout>
      <section className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">รายการผู้แต่ง</h1>

          <Button asChild size="sm">
            <Link to="/authors/create">
              <Plus />
              เพิ่มผู้แต่ง
            </Link>
          </Button>
        </div>

        {!authors && !error && <Loading />}
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
          {authors?.map((author) => (
            <div
              className="border border-solid border-neutral-200 rounded-lg p-4 flex flex-col gap-2"
              key={author.id}
            >
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-neutral-400" />
                <h2 className="text-lg font-semibold line-clamp-1">{author.name}</h2>
              </div>

              <div className="flex justify-end">
                <Button asChild variant="outline" size="xs">
                  <Link to={`/authors/${author.id}`}>ดูรายละเอียด</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
