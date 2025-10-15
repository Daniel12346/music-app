import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import Me from "./searchResults";
import { getSearchResults } from "@/lib/database";

export default async function SearchResultsPage({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const supabase = await createClient();
  const { query } = await params;
  const searchResults = await getSearchResults(supabase, query);

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getSearchResults", query])]: searchResults,
        },
      }}
    >
      <Me />
    </SWRConfig>
  );
}
