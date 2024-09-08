import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub({
      profile(githubProfile) {
        return {
          id: String(githubProfile.id),
          name: githubProfile.name,
          email: githubProfile.email,
          image: githubProfile.picture as string | null | undefined,
          githubId: githubProfile.id,
        };
      },
    }),
  ],
});
