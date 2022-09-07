import { DefaultSession, User as NAUser} from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      approved?: boolean;
    } & DefaultSession["user"];
  }
  interface User extends NAUser {
    approved: boolean;
  }
}
