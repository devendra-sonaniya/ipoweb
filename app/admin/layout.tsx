import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "IPOWEB Admin",
  description: "Private IPOWEB administration area.",
  path: "/admin",
  keywords: [],
  index: false,
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
