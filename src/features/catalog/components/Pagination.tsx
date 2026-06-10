import { buildCatalogUrl, type CatalogFilters } from "../lib/filters";

type Props = {
  filters: CatalogFilters;
  total: number;
  basePath?: string;
};

export function Pagination({ filters, total, basePath = "/katalog" }: Props) {
  const totalPages = Math.ceil(total / filters.perPage);
  if (totalPages <= 1) return null;

  const { page } = filters;
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const pageUrl = (p: number) => buildCatalogUrl(basePath, { ...filters, page: p });

  return (
    <nav aria-label="Paginacja" className="flex items-center justify-center gap-1">
      {page > 1 && (
        <a
          href={pageUrl(page - 1)}
          className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-muted"
          aria-label="Poprzednia strona"
        >
          ‹
        </a>
      )}

      {start > 1 && (
        <>
          <a
            href={pageUrl(1)}
            className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-muted"
          >
            1
          </a>
          {start > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}

      {pages.map((p) => (
        <a
          key={p}
          href={pageUrl(p)}
          aria-current={p === page ? "page" : undefined}
          className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm ${
            p === page
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted"
          }`}
        >
          {p}
        </a>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground">…</span>}
          <a
            href={pageUrl(totalPages)}
            className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-muted"
          >
            {totalPages}
          </a>
        </>
      )}

      {page < totalPages && (
        <a
          href={pageUrl(page + 1)}
          className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-muted"
          aria-label="Następna strona"
        >
          ›
        </a>
      )}
    </nav>
  );
}
