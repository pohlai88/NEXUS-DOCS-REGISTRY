// @aibos/docs-registry — MCP Server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PURPOSE: Expose docs-registry functions via Model Context Protocol
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
  type ListToolsResult,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditAll,
  auditChecksum,
  auditIndex,
  auditOrphans,
  discoverDocs,
  generateDocs,
  generateIndex,
} from "../core/index.js";
import { DocJsonSchema } from "../schema/index.js";
import type { DocsRegistryConfig } from "../types/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Default docs directory (relative to current working directory)
 */
const DEFAULT_DOCS_DIR = "docs";

/**
 * Create and configure the MCP server
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: "@aibos/docs-registry-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async (): Promise<ListToolsResult> => {
    return {
      tools: [
        {
          name: "docs_generate",
          description:
            "Generate managed header blocks for all documents and update INDEX.md",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_generate_index",
          description: "Generate INDEX.md from filesystem scan",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_audit_all",
          description:
            "Run full audit: schema validation, checksum verification, and orphan detection",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_audit_checksum",
          description: "Audit checksum integrity for all documents",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_audit_index",
          description: "Audit INDEX.md for phantom and missing documents",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_audit_orphans",
          description: "Detect orphaned documents (not in INDEX.md)",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_discover",
          description: "Discover and validate all documents in the docs directory",
          inputSchema: {
            type: "object",
            properties: {
              docsDir: {
                type: "string",
                description: "Root directory containing docs (default: 'docs')",
                default: DEFAULT_DOCS_DIR,
              },
            },
          },
        },
        {
          name: "docs_validate",
          description: "Validate a single doc.json file against the schema",
          inputSchema: {
            type: "object",
            properties: {
              docJsonPath: {
                type: "string",
                description: "Path to doc.json file to validate",
              },
            },
            required: ["docJsonPath"],
          },
        },
      ] as Tool[],
    };
  });

  // Handle tool calls
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request): Promise<CallToolResult> => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "docs_generate": {
            const config1: DocsRegistryConfig = {
              docsDir: (args?.docsDir as string) || DEFAULT_DOCS_DIR,
            };
            const result1 = await generateDocs(config1);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      success: true,
                      processed: result1.processed,
                      updated: result1.updated,
                      errors: result1.errors,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_generate_index": {
            const config2: DocsRegistryConfig = {
              docsDir: (args?.docsDir as string) || DEFAULT_DOCS_DIR,
            };
            await generateIndex(config2);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      success: true,
                      message: "INDEX.md generated successfully",
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_audit_all": {
            const config3: DocsRegistryConfig = {
              docsDir: (args?.docsDir as string) || DEFAULT_DOCS_DIR,
            };
            const result3 = await auditAll(config3);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      passed: result3.passed,
                      violations: result3.violations,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_audit_checksum": {
            const config4: DocsRegistryConfig = {
              docsDir: (args?.docsDir as string) || DEFAULT_DOCS_DIR,
            };
            const result4 = await auditChecksum(config4);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      passed: result4.passed,
                      violations: result4.violations,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_audit_index": {
            const config5: DocsRegistryConfig = {
              docsDir: (args?.docsDir as string) || DEFAULT_DOCS_DIR,
            };
            const result5 = await auditIndex(config5);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      passed: result5.passed,
                      violations: result5.violations,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_audit_orphans": {
            const config6: DocsRegistryConfig = {
              docsDir: (args?.docsDir as string) || DEFAULT_DOCS_DIR,
            };
            const result6 = await auditOrphans(config6);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      passed: result6.passed,
                      violations: result6.violations,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_discover": {
            const docsDir = (args?.docsDir as string) || DEFAULT_DOCS_DIR;
            const docs = await discoverDocs(docsDir);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      count: docs.length,
                      documents: docs.map((d) => ({
                        docId: d.docId,
                        docJsonPath: d.docJsonPath,
                        docMdPath: d.docMdPath,
                        title: d.docJson.title,
                        type: d.docJson.document_type,
                        status: d.docJson.status,
                      })),
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case "docs_validate": {
            const docJsonPath = args?.docJsonPath as string;
            if (!docJsonPath) {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        success: false,
                        error: "docJsonPath is required",
                      },
                      null,
                      2
                    ),
                  },
                ],
                isError: true,
              };
            }

            const raw = JSON.parse(
              fs.readFileSync(docJsonPath, "utf8")
            );
            const result = DocJsonSchema.safeParse(raw);

            if (!result.success) {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        success: false,
                        valid: false,
                        errors: result.error.issues,
                      },
                      null,
                      2
                    ),
                  },
                ],
              };
            }

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      success: true,
                      valid: true,
                      document: {
                        document_id: result.data.document_id,
                        document_type: result.data.document_type,
                        title: result.data.title,
                        status: result.data.status,
                      },
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          default:
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      success: false,
                      error: `Unknown tool: ${name}`,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: true,
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : String(error),
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}

/**
 * Main entry point for MCP server
 */
async function main() {
  const server = createServer();

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("@aibos/docs-registry MCP server running on stdio");
}

// Run the server
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

