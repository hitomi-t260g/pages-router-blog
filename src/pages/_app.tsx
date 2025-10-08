import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import MoodSync from "../commons/theme/MoodSync";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <ChakraProvider>
        <MoodSync />
        <Component {...pageProps} />
      </ChakraProvider>
    </JotaiProvider>
  );
}
