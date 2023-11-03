import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/app/lib/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();

    const user = getUser();

    if (!user || !user.id || !user.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if user is in db
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    // if Exist
    if (dbUser) {
      return {
        success: true,
      };
    }

    // if Not Exist
    const newUser = await db.user.create({
      data: {
        id: user.id,
        name: user.given_name + `${user.family_name}`,
        email: user.email,
        picture: user.picture,
      },
    });

    // if Something went Wrong
    if (!newUser) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }),
});

export type AppRouter = typeof appRouter;
