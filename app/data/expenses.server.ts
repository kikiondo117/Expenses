import { type ExpenseData } from "~/interfaces/expenses";
import { prisma } from "./database.server";

export async function addExpense({
  expenseData,
  userId,
}: {
  expenseData: ExpenseData;
  userId: string;
}) {
  // * El expenseData es un string, con el + lo combertimos a number
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
        User: { connect: { id: userId } }, // Le dice a prisma que debe de conectar el expense con un usuario existente
      },
    });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getExpenses({ userId }: { userId: string }) {
  if (!userId) {
    throw new Error("Failed to get expenses. ");
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: userId },
      orderBy: { date: "desc" },
    });
    return expenses;
  } catch (error) {
    throw new Error("Failed to get expenses. ");
  }
}

export async function getExpense({ id }: { id: string }) {
  try {
    const expense = await prisma.expense.findFirst({
      where: {
        id: id,
      },
    });
    return expense;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateExpense({
  id,
  expenseData,
}: {
  id: string;
  expenseData: ExpenseData;
}) {
  try {
    await prisma.expense.update({
      where: {
        id,
      },
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteExpense({ id }: { id: string }) {
  try {
    await prisma.expense.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    // Evitemos enviar al front informacion delicada como los errores por defecto
    console.error(error);
    // throw error;
    throw new Error("Failded to delete expense.");
  }
}
