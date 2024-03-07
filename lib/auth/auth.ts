// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm";
import { getUserByEmail } from "@/data/user";
import { users } from "../db/schema";

let userInfo = {
  id: "",
  email: "",
  name: "",
}

// sign in with email and password
async function authorize(credentials: any) {
  if (!credentials?.email || !credentials.password) {
    return null;
  }
  
  let user = await getUserByEmail(credentials.email as string);
  
  if (!user?.length) {
    return null;
  }
  
  userInfo = {...user as any};
  
  return user;
}

// sign in with google or github
async function signIn({ user, account, credentials }: { user: any; account: any; credentials: any }) {
  // prevent signInUser from running if authorizeUser has already run
  if(credentials?.email){
    return true;
  }
  if (account?.provider === "google" || account?.provider === "github") {
    try {
      if(user?.email){
        let result = await getUserByEmail(user.email);
        if (result?.length === 0) {
          await db.insert(users).values({ name: user.name as string ,email: user.email as string, password: account.provider as string });
          result = await getUserByEmail(user.email);
        }

        userInfo = {...result as any};

        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  return false;
}

async function jwt({ token, user, account }: { token: any; user: any; account: any }) {
  // cant use the user object to get the id cus the data is not updated when using oauth but only in credentials login
  // user object contains info from credentials or from oauth default user object, it will then disappaer aftre this function runs
  if (user || account?.provider === "google" || account?.provider === "github") {
    return userInfo;
  }  
  return token;
}

async function session({ session, token }: { session: any; token: any }) {
  if (token) {
    session.user = token;
  }
  return session.user;
}

export const {
  handlers: { GET, POST },
  auth,
  // signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [GitHub,Google,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize
    }),
  ],
  pages : {
    signIn: '/login',
  },
  callbacks: {
    signIn,
    jwt,
    session
  }
})
