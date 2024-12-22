import { BackToHome } from "@/components/backToHome/backToHome";

type UserAgentProps = {
  initialUserAgent: string;
};

export const UserAgent: React.FC<UserAgentProps> = ({ initialUserAgent }) => {
  return (
    <div>
      <BackToHome />
      <div className="flex font-mono font-semibold text-sm">
        <div className="border p-2">UserAgent</div>
        <div className="border p-2">{initialUserAgent}</div>
      </div>
    </div>
  );
};
