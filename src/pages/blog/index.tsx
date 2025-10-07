import { useEffect } from "react";
import { useRouter } from "next/router";

export default function BlogIndex() {
  const router = useRouter();

  useEffect(() => {
    // ホームページにリダイレクト
    router.replace("/");
  }, [router]);

  return null;
}
