import { getApi } from "./base";

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  borrowCount: number;
}

export interface TopCategoriesResponse {
  data: TopCategory[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export async function getTopCategories(
  from: string,
  to: string,
  pageNumber: number = 1,
  pageSize: number = 5
): Promise<TopCategoriesResponse> {
  const params = new URLSearchParams({
    from,
    to,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await getApi<TopCategoriesResponse>(
    `/book-categories/top-categories?${params.toString()}`
  );

  console.log('📊 getTopCategories response:', response);
  // If API returns { data: [...] }, extract it, otherwise return as-is
  return (response as any).data ? (response as any).data : response;
}

export interface BorrowCountStatDto {
  fromDate: string;
  toDate: string;
  total: number;
  dailyCounts: number[];
}

export async function getBorrowStatistics(
  fromDate: string,
  toDate: string
): Promise<BorrowCountStatDto> {
  const params = new URLSearchParams({
    fromDate,
    toDate,
  });

  const response = await getApi<BorrowCountStatDto>(
    `/statistics/by-borrow-count?${params.toString()}`
  );

  console.log('📊 getBorrowStatistics response:', response);
  return response;
}

export interface MemberBorrowCountStatDto {
  memberName: string;
  borrowCount: number;
}

export async function getTopMembersByBorrowCount(
  fromDate: string,
  toDate: string,
  topN: number = 5
): Promise<MemberBorrowCountStatDto[]> {
  const params = new URLSearchParams({
    fromDate,
    toDate,
    topN: topN.toString(),
  });

  const response = await getApi<MemberBorrowCountStatDto[]>(
    `/statistics/by-member-count?${params.toString()}`
  );

  return response || [];
}

export interface TotalCountsDto {
  totalMembers: number;
  totalBooks: number;
  totalBorrowRequests: number;
}

export async function getTotalCounts(): Promise<TotalCountsDto> {
  const response = await getApi<TotalCountsDto>('/statistics/total');
  console.log('📡 getTotalCounts raw response:', response);
  return response;
}
