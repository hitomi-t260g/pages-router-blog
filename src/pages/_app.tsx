import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import { system } from "../commons/theme";
import MoodSync from "../commons/theme/MoodSync";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <ChakraProvider value={system}>
        <MoodSync />
        <Component {...pageProps} />
      </ChakraProvider>
    </JotaiProvider>
  );
}
