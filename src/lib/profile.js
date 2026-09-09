import { generateShortId } from "./utils";

export const ensureProfile = async (supabase, user) => {
  if (!user) return null;

  // Check whether profile already exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking profile:", fetchError);
    return null;
  }

  // Profile already exists
  if (existingProfile) {
    return existingProfile;
  }

  // Create profile only once
  const profileData = {
    id: user.id,
    sb_user_id: generateShortId(user.id),
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "",
    email: user.email,
  };

  console.log("Creating profile:", profileData);

  const { data, error } = await supabase
    .from("profiles")
    .insert(profileData)
    .select()
    .single();

  if (error) {
    console.error("Error creating profile:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  console.log("Profile created:", data);

  return data;
};