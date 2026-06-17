"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchInput({ placeholder = "Buscar...", paramName = "busca" }: { placeholder?: string, paramName?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get(paramName) || "";
  
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentParam = searchParams.get(paramName) || "";
      if (currentParam === searchTerm) return;

      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set(paramName, searchTerm);
        params.set("page", "1"); // Reset pagination on new search
      } else {
        params.delete(paramName);
      }
      
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams, paramName]);

  return (
    <div className="relative w-full sm:w-auto">
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder} 
        className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-light"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
    </div>
  );
}
