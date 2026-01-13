import type { Scougi, ScougiPage, User } from "./db/schema";
import type { CreatePageReq, CreateScougiReq } from "./schemas";

export const GetAllScougis = async () => {
  const resp = await fetch("/api/scougi/all");
  if (!resp.ok) {
    throw new Error("Failed to fetch all scougis")
  }
  return await resp.json() as Scougi[];
}

export const GetPageData = async (scougId: number, pageNr: number) => {
  const resp = await fetch(`/api/scougi/${scougId}/page?pageNr=${pageNr}`);
  if (!resp.ok) {
    throw new Error("Failed to fetch scougi page")
  }
  return await resp.json() as ScougiPage;
}

export const GetNonApprovedUsers = async () => {
  const resp = await fetch(`/api/users`);
  if (!resp.ok) {
    throw new Error("Failed to fetch users")
  }
  return await resp.json() as User[];
}

export const createScougi = async (input: CreateScougiReq) => {
  const resp = await fetch("/api/scougi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch create new scougi");
  }
  return await resp.json() as Scougi;
}

export const createScougiPage = async (input: CreatePageReq & { scougiId: number }) => {
  const resp = await fetch(`/api/scougi/${input.scougiId}/page`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch create new scougi");
  }
}

export const approvedUser = async (userId: string) => {
  const resp = await fetch(`/api/users/${userId}`, {
    method: "POST",
  })
  if (!resp.ok) {
    throw new Error("Failed to approved user");
  }
}

export const deleteScougi = async (scougiId: number) => {
  const resp = await fetch(`/api/scougi/${scougiId}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch create new scougi");
  }
}
