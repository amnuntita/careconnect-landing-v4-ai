"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

// Embedded Studio config, mounted at /studio (see app/studio/[[...tool]]).
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id("root")
          .title("เนื้อหา")
          .items([
            S.documentTypeListItem("post").title("บทความ"),
            S.documentTypeListItem("category").title("หมวดหมู่"),
            S.documentTypeListItem("author").title("ผู้เขียน / ผู้ตรวจสอบ"),
            S.divider(),
            // Settings as a single (singleton) document.
            S.listItem()
              .title("ตั้งค่าบล็อก")
              .id("settings")
              .child(
                S.document().schemaType("settings").documentId("settings"),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
