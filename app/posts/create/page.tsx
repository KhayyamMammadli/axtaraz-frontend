import type { Metadata } from "next";
import { PostEditor } from "@/features/posts/post-editor";
export const metadata: Metadata = { title: "Yeni bloq yerləşdir", robots: { index: false, follow: false } };
export default function CreatePostPage() { return <PostEditor/>; }
