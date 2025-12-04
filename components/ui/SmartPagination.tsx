import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SmartPaginationProps {
  page: number; // trang hiện tại (1-based)
  totalPages: number; // tổng số trang
  onChange: (page: number) => void;
}

export function SmartPagination({
  page,
  totalPages,
  onChange,
}: SmartPaginationProps) {
  const pages: (number | "...")[] = [];

  // Trang đầu
  pages.push(1);

  // Hiện "..."" nếu cách xa
  if (page > 3) pages.push("...");

  // Trang ngay trước current
  if (page > 2) pages.push(page - 1);

  // Trang hiện tại
  if (page !== 1 && page !== totalPages) pages.push(page);

  // Trang ngay sau current
  if (page < totalPages - 1) pages.push(page + 1);

  // Hiện "..."
  if (page < totalPages - 2) pages.push("...");

  // Trang cuối
  if (totalPages > 1) pages.push(totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => page > 1 && onChange(page - 1)} />
        </PaginationItem>

        {pages.map((p, index) =>
          p === "..." ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onChange(p as number)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => page < totalPages && onChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
