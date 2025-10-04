import { createSystem, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "var(--brand-50, #f0f9ff)" },
          100: { value: "var(--brand-100, #e0f2fe)" },
          200: { value: "var(--brand-200, #bae6fd)" },
          300: { value: "var(--brand-300, #7dd3fc)" },
          400: { value: "var(--brand-400, #38bdf8)" },
          500: { value: "var(--brand-500, #0ea5e9)" },
          600: { value: "var(--brand-600, #0284c7)" },
          700: { value: "var(--brand-700, #0369a1)" },
          800: { value: "var(--brand-800, #075985)" },
          900: { value: "var(--brand-900, #0c4a6e)" },
        },
      },
    },
  },
});

export const system = createSystem(config);
export default system;
