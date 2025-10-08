import { useRouter } from "next/router";
import { useEffect } from "react";

export default function BlogIndex() {
  const router = useRouter();

  useEffect(() => {
    // ホームページにリダイレクト
    router.replace("/");
  }, [router]);

  return null;
}
