import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import axios from "axios";
import HomePage from "./pages";
import BooksPage from "./pages/books";
import BookByIdPage from "./pages/book-by-id";
import BookEditById from "./pages/book-edit-by-id";
import BookCreatePage from "./pages/book-create";
import AuthorsPage from "./pages/authors";
import AuthorByIdPage from "./pages/author-by-id";
import AuthorCreatePage from "./pages/author-create";
import AuthorEditById from "./pages/author-edit-by-id";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/books/create",
    element: <BookCreatePage />,
  },
  {
    path: "/books/:bookId",
    element: <BookByIdPage />,
  },
  {
    path: "/books/:bookId/edit",
    element: <BookEditById />,
  },
  {
    path: "/authors",
    element: <AuthorsPage />,
  },
  {
    path: "/authors/create",
    element: <AuthorCreatePage />,
  },
  {
    path: "/authors/:authorId",
    element: <AuthorByIdPage />,
  },
  {
    path: "/authors/:authorId/edit",
    element: <AuthorEditById />,
  },
]);

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}
if (import.meta.env.VITE_API_SECRET) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${import.meta.env.VITE_API_SECRET}`;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          axios
            .get(url, {
              baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api",
            })
            .then((res) => res.data),
      }}
    >
      <RouterProvider router={router} />
      <Toaster />
    </SWRConfig>
  </React.StrictMode>,
);
