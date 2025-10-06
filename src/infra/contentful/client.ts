import { createClient } from "contentful";

export const contentfulClient = createClient({
  space:
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ||
    process.env.CONTENTFUL_SPACE_ID ||
    "",
  accessToken:
    process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ||
    process.env.CONTENTFUL_ACCESS_TOKEN ||
    "",
  environment:
    process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ||
    process.env.CONTENTFUL_ENVIRONMENT ||
    "master",
});
