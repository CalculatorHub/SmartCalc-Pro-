import { useState, useEffect } from "react";

export default function useAuth() {
  const [user] = useState<any | null>(null);

  useEffect(() => {
    // Auth deactivated as per Master Protocol
  }, []);

  return user;
}
