import { ReactNode } from "react";

interface InfoBoxProps {
  title: string;
  children: ReactNode;
  borderColorClass?: string; // Ex: "border-green-500"
  titleColorClass?: string;  // Ex: "text-green-400"
  icon?: ReactNode;
}

export default function InfoBox({
  title,
  children,
  borderColorClass = "border-gray-500",
  titleColorClass = "text-white",
  icon,
}: InfoBoxProps) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-l-4 ${borderColorClass}`}>
      <h3 className={`font-medium mb-2 flex items-center gap-2 ${titleColorClass}`}>
        {icon} {title}
      </h3>
      <div className="text-gray-300 text-sm">
        {children}
      </div>
    </div>
  );
}
