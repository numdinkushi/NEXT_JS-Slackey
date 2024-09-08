'use client';

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";


export default function Home() {

  const { signOut } = useAuthActions();

  return (
    <div>
      <div className="">
        Logged in!
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
}
