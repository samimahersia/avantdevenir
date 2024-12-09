import { Profile } from "../UserProfileSection";

interface ProfileEmailProps {
  profile: Profile;
}

export function ProfileEmail({ profile }: ProfileEmailProps) {
  return (
    <span className="text-sm text-blue-500 font-medium">
      {profile.email}
    </span>
  );
}