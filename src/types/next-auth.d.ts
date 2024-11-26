import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: string;
    isAcceptingMessages?: string;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: string;
      isAcceptingMessages?: string;
      username?: string;
    } & DefaultSession['user']
  }
}

// another way

declare module 'next-auth/jwt' {
    interface JWT {
      _id?: string;
      isVerified?: string;
      isAcceptingMessages?: string;
      username?: string;
    }
}