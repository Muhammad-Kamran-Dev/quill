import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { FC } from "react";
import { db } from "../lib/db";
import { DashBoard } from "@/components";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) return redirect("/auth-callback?origin=dashboard");

  // check if user is in Db or not
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) return redirect("/auth-callback?origin=dashboard");

  // Render Client DashBoard Component
  return <DashBoard />;
};

export default page;
