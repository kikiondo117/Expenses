// Solo backend code
import { prisma } from "./database.server";
import { hash, compare } from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

interface CustomError extends Error {
  status?: number;
}

// ANCHOR session cookie
// secrets: Tenemos que tener una env secreta
const SESSION_SECRET = process.env.SESSION_SECRET;
// Cookie session cookie: sendback al usuario
// secure: es para que solo funcione en https o no true/false
// secrets: tenemos que agregar una palabra secreta con la que va a firmar el backend
// sameSite: Protege de ataques
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxEge: 30 * 24 * 60 * 60, // 30 dias
    httpOnly: true,
  },
});

async function createUserSession({
  userId,
  redirectPath,
}: {
  userId: string;
  redirectPath: string;
}) {
  const session = await sessionStorage.getSession(); // Remix internamete nos genera una session
  session.set("userId", userId);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session), // Le pasa la session que hemos creado, es como salvar nuestra session con el usuario
    },
  });
}

// ANCHOR Get User From Session
export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const userId = session.get("userId"); // Si no hay un user id es que no es una session valida :o

  if (!userId) {
    return null;
  }

  return userId;
}

// ANCHOR Destroy User Session
export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session), // * returns the Set-Cookie header to be used in the HTTP response.
    },
  });
}

// ANCHOR Require User Session
export async function requireUserSession(request: Request) {
  const userId = await getUserFromSession(request);

  // * Este redirect functiona paro los loaders anidados van a continuar ya que hay un nested
  // Para solucionarlo tenemos que utilizarlo en todas las rutas nesteadas :c
  if (!userId) {
    throw redirect("/auth?mode=login");
  }

  return userId;
}

// ANCHOR Signup
export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  // ANCHOR Existing User
  if (existingUser) {
    const error: CustomError = new Error(
      " A user with the provider email address existing already"
    );
    error.status = 422; // User input problem
    throw error;
  }

  // Tenemos que encryptar la password
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({
    data: { email: email, password: passwordHash },
  });

  return createUserSession({ userId: user.id, redirectPath: "/expenses" });
}

// ANCHOR Login
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    const error: CustomError = new Error(
      "Could not log you in, please check the provided credentials."
    );
    error.status = 401; // Auth problem
    throw error;
  }

  const passwordCorrect = await compare(password, existingUser.password);

  if (!passwordCorrect) {
    const error: CustomError = new Error(
      "Could not log you in, please check the provided credentials."
    );
    error.status = 401; // Auth problem
    throw error;
  }

  return createUserSession({
    userId: existingUser.id,
    redirectPath: "/expenses",
  });
}
