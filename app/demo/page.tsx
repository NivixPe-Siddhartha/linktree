import { ProfilePage } from "@/components/public/profile-page"
import { Profile, Link } from "@/lib/types"

const demoProfile: Profile = {
  id: "demo",
  username: "demo",
  display_name: "Alex Johnson",
  bio: "Digital creator, developer, and coffee enthusiast. Building cool things on the internet.",
  avatar_url: null,
  theme: "default",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const demoLinks: Link[] = [
  {
    id: "1",
    user_id: "demo",
    title: "My Portfolio",
    url: "https://example.com",
    icon: "globe",
    position: 0,
    is_active: true,
    clicks: 1234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    title: "Latest Blog Post",
    url: "https://example.com/blog",
    icon: "file-text",
    position: 1,
    is_active: true,
    clicks: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    title: "Follow me on Twitter",
    url: "https://twitter.com",
    icon: "twitter",
    position: 2,
    is_active: true,
    clicks: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo",
    title: "GitHub Projects",
    url: "https://github.com",
    icon: "github",
    position: 3,
    is_active: true,
    clicks: 456,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "demo",
    title: "Subscribe to Newsletter",
    url: "https://example.com/newsletter",
    icon: "mail",
    position: 4,
    is_active: true,
    clicks: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function DemoPage() {
  return <ProfilePage profile={demoProfile} links={demoLinks} isDemo />
}
