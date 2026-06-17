import { SearchX } from "lucide-react";

export function EmptyState({ message, colSpan = 5 }: { message: string, colSpan?: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <SearchX className="w-8 h-8 mb-3 opacity-50" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
}
