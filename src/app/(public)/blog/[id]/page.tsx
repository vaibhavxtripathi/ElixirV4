import { redirect } from "next/navigation";

export default function BlogDetail({ params }: { params: { id: string } }) {
  redirect(`/blogs/${encodeURIComponent(params.id)}`);
}
