import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  studentBodySchema,
  studentIdParamsSchema,
  studentUpdateSchema,
} from "../schemas/students.js";
import {
  createStudent,
  deleteStudent,
  DuplicateStudentCodeError,
  getStudentById,
  getStudents,
  updateStudent,
} from "../services/students.js";

export const studentsController = new Hono();

const duplicateResponse = { error: "Student code already exists" };

studentsController.get("/", async (c) => c.json(await getStudents()));

studentsController.get("/:studentId", zValidator("param", studentIdParamsSchema), async (c) => {
  const { studentId } = c.req.valid("param");
  const student = await getStudentById(studentId);

  if (!student) {
    return c.json({ error: "Student not found" }, 404);
  }

  return c.json(student);
});

studentsController.post("/", zValidator("json", studentBodySchema), async (c) => {
  try {
    const student = await createStudent(c.req.valid("json"));
    c.header("Location", `/api/v1/students/${student.id}`);
    return c.json(student, 201);
  } catch (error) {
    if (error instanceof DuplicateStudentCodeError) {
      return c.json(duplicateResponse, 409);
    }
    throw error;
  }
});

studentsController.patch(
  "/:studentId",
  zValidator("param", studentIdParamsSchema),
  zValidator("json", studentUpdateSchema),
  async (c) => {
    const { studentId } = c.req.valid("param");

    try {
      const student = await updateStudent(studentId, c.req.valid("json"));

      if (!student) {
        return c.json({ error: "Student not found" }, 404);
      }

      return c.json(student);
    } catch (error) {
      if (error instanceof DuplicateStudentCodeError) {
        return c.json(duplicateResponse, 409);
      }
      throw error;
    }
  },
);

studentsController.delete("/:studentId", zValidator("param", studentIdParamsSchema), async (c) => {
  const { studentId } = c.req.valid("param");

  if (!(await deleteStudent(studentId))) {
    return c.json({ error: "Student not found" }, 404);
  }

  return c.body(null, 204);
});
