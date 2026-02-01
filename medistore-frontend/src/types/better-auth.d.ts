import "better-auth";

declare module "better-auth" {
  interface User {
    role: "ADMIN" | "SELLER" | "CUSTOMER";
  }

  interface Session {
    user: User;
  }
}
