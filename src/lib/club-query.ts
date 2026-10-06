import { queryOptions } from "@tanstack/react-query";
import { getPublicClub } from "./club.functions";
export const clubQuery = queryOptions({
  queryKey: ["public-club"],
  queryFn: () => getPublicClub(),
  staleTime: 30_000,
});
