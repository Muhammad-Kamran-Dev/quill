"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

interface AuthProps {}

const Auth: FC<AuthProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      // if user is in sync with db
      if (success) {
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center ">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting Up Your Account ... </h3>
        <p>You will be redirected Automatically.</p>
      </div>
    </div>
  );
};

export default Auth;
