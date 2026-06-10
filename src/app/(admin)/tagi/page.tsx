import { TagForm } from "@/features/products/components/TagForm";
import { prisma } from "@/lib/prisma";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({ orderBy: { sortOrder: "asc" } });
  return <TagForm tags={tags} />;
}
