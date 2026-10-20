
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function fetchCorporateActionsByAliases(
  aliases,
  limit = 2000
) {
  if (!Array.isArray(aliases) || aliases.length === 0) {
    console.error(
      "[Corporate Actions] No action type aliases supplied:",
      aliases
    );
    return [];
  }

  const { data, error } = await supabasePublic
    .from("corporate_actions")
    .select(`
      *,
      blog:blogs (
        id,
        slug,
        heading
      )
    `)
    .in("action_type", aliases)
    .order("ex_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Corporate Actions] Supabase query failed", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      aliases,
    });

    throw new Error(
      `Failed to fetch corporate actions: ${error.message}`
    );
  }

  console.info("[Corporate Actions] Server query completed", {
    aliases,
    recordCount: data?.length ?? 0,
  });

  return data ?? [];
}
