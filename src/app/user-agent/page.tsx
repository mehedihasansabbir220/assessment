import { UserAgent } from "@/views/userAgent";
import { headers } from "next/headers";

const UserAgentRoot = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  return <UserAgent initialUserAgent={userAgent || "No user agent available"} />;
};

export default UserAgentRoot;
