import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document, Node } from "@contentful/rich-text-types";
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";
import type { ReactNode } from "react";

interface RichTextRendererProps {
  document: Document;
}

interface EmbeddedAssetNode extends Node {
  data: {
    target: {
      sys: {
        id: string;
      };
      fields: {
        title?: string;
        description?: string;
        file?: {
          url: string;
          details?: {
            size: number;
            image?: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
  };
}

interface TextNode {
  nodeType: "text";
  value: string;
  data: Record<string, unknown>;
  marks: Array<Record<string, unknown>>;
}

interface ParagraphNode extends Node {
  content: TextNode[];
}

export function RichTextRenderer({ document }: RichTextRendererProps) {
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Node): ReactNode => {
        const embeddedNode = node as EmbeddedAssetNode;
        const target = embeddedNode.data?.target;

        if (!target || !target.fields) {
          return null;
        }

        const { title, description, file } = target.fields;
        const imageUrl = file?.url;

        if (!imageUrl) {
          return null;
        }

        // URLの正規化（httpsを追加）
        const normalizedUrl = imageUrl.startsWith("//")
          ? `https:${imageUrl}`
          : imageUrl;

        return (
          <div style={{ margin: "2rem 0" }}>
            <Image
              src={normalizedUrl}
              alt={title || description || "Embedded image"}
              width={800}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            {(title || description) && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.9em",
                  color: "#666",
                  fontStyle: "italic",
                  marginTop: "0.5rem",
                }}
              >
                {title || description}
              </p>
            )}
          </div>
        );
      },
      [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode): ReactNode => {
        // Check if this paragraph contains only a markdown image
        const paragraphNode = node as ParagraphNode;
        if (paragraphNode.content && paragraphNode.content.length === 1) {
          const textNode = paragraphNode.content[0];
          if (textNode.nodeType === "text" && textNode.value) {
            const imageRegex = /^!\[([^\]]*)\]\((https?:)?\/\/([^)]+)\)$/;
            const match = textNode.value.match(imageRegex);

            if (match) {
              const alt = match[1] || "Image";
              const protocol = match[2] || "https:";
              const url = match[3];
              const fullUrl = `${protocol}//${url}`;

              return (
                <div style={{ margin: "2rem 0" }}>
                  <Image
                    src={fullUrl}
                    alt={alt}
                    width={800}
                    height={600}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  {alt && (
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "0.9em",
                        color: "#666",
                        fontStyle: "italic",
                        marginTop: "0.5rem",
                      }}
                    >
                      {alt}
                    </p>
                  )}
                </div>
              );
            }
          }
        }

        // Default paragraph rendering
        return (
          <p
            style={{
              marginBottom: "1.5rem",
              lineHeight: "1.8",
            }}
          >
            {children}
          </p>
        );
      },
      [BLOCKS.HEADING_1]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <h2
            style={{
              fontSize: "2em",
              fontWeight: "bold",
              marginTop: "2.5rem",
              marginBottom: "1rem",
              lineHeight: "1.3",
              color: "#333",
            }}
          >
            {children}
          </h2>
        );
      },
      [BLOCKS.HEADING_2]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <h3
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              marginTop: "2rem",
              marginBottom: "1rem",
              lineHeight: "1.3",
              color: "#333",
            }}
          >
            {children}
          </h3>
        );
      },
      [BLOCKS.HEADING_3]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <h4
            style={{
              fontSize: "1.25em",
              fontWeight: "bold",
              marginTop: "1.5rem",
              marginBottom: "1rem",
              lineHeight: "1.3",
              color: "#333",
            }}
          >
            {children}
          </h4>
        );
      },
      [BLOCKS.UL_LIST]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <ul
            style={{
              marginBottom: "1.5rem",
              paddingLeft: "2rem",
            }}
          >
            {children}
          </ul>
        );
      },
      [BLOCKS.OL_LIST]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <ol
            style={{
              marginBottom: "1.5rem",
              paddingLeft: "2rem",
            }}
          >
            {children}
          </ol>
        );
      },
      [BLOCKS.LIST_ITEM]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <li
            style={{
              marginBottom: "0.5rem",
              lineHeight: "1.6",
            }}
          >
            {children}
          </li>
        );
      },
      [BLOCKS.QUOTE]: (_node: Node, children: ReactNode): ReactNode => {
        return (
          <blockquote
            style={{
              borderLeft: "4px solid #0066cc",
              paddingLeft: "1.5rem",
              margin: "2rem 0",
              fontStyle: "italic",
              color: "#555",
              backgroundColor: "#f9f9f9",
              padding: "1rem 1.5rem",
              borderRadius: "4px",
            }}
          >
            {children}
          </blockquote>
        );
      },
    },
  };

  return <div>{documentToReactComponents(document, options)}</div>;
}
