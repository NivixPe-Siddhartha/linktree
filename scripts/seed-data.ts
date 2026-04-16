import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedData() {
  console.log("Starting seed process...")

  // 1. Create user via Admin API
  const email = "sahi0045@hotmail.com"
  const password = "Sahi@0045"

  console.log("Creating user...")
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email so user can login immediately
    })

  if (userError) {
    // Check if user already exists
    if (userError.message.includes("already been registered")) {
      console.log("User already exists, fetching user...")
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === email)
      if (existingUser) {
        console.log("Found existing user:", existingUser.id)
        await createProfileAndLinks(existingUser.id)
        return
      }
    }
    console.error("Error creating user:", userError)
    return
  }

  console.log("User created successfully:", userData.user?.id)

  if (userData.user) {
    await createProfileAndLinks(userData.user.id)
  }
}

async function createProfileAndLinks(userId: string) {
  // 2. Create profile
  console.log("Creating profile...")

  // First check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single()

  if (existingProfile) {
    console.log("Profile already exists, updating...")
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: "sahi0045",
        display_name: "Sahi",
        bio: "Welcome to my profile!",
        theme: "default",
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return
    }
  } else {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username: "sahi0045",
      display_name: "Sahi",
      bio: "Welcome to my profile!",
      theme: "default",
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      return
    }
  }

  console.log("Profile created/updated successfully")

  // 3. Delete existing links and create new ones
  console.log("Creating links...")

  await supabase.from("links").delete().eq("user_id", userId)

  const links = [
    {
      user_id: userId,
      title: "My Website",
      url: "https://example.com",
      icon: "globe",
      position: 0,
      is_active: true,
    },
    {
      user_id: userId,
      title: "Twitter / X",
      url: "https://twitter.com/sahi0045",
      icon: "twitter",
      position: 1,
      is_active: true,
    },
    {
      user_id: userId,
      title: "GitHub",
      url: "https://github.com/sahi0045",
      icon: "github",
      position: 2,
      is_active: true,
    },
    {
      user_id: userId,
      title: "Email",
      url: "mailto:sahi0045@hotmail.com",
      icon: "mail",
      position: 3,
      is_active: true,
    },
  ]

  const { error: linksError } = await supabase.from("links").insert(links)

  if (linksError) {
    console.error("Error creating links:", linksError)
    return
  }

  console.log("Links created successfully")
  console.log("\n✅ Seed completed!")
  console.log("----------------------------------------")
  console.log("Login credentials:")
  console.log("Email: sahi0045@hotmail.com")
  console.log("Password: Sahi@0045")
  console.log("----------------------------------------")
  console.log("Public profile: /sahi0045")
  console.log("Dashboard: /dashboard")
}

seedData()
