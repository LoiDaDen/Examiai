"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { getPostLoginPath } from "@/lib/auth/redirect";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/");
        return;
      }

      router.replace(await getPostLoginPath());
    }

    finishLogin();
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background">
      <Spinner className="size-8" />
    </main>
  );
}
