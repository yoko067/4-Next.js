'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
  
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); // 現在のURLパラメータを取得する関数
  const pathname = usePathname(); // 現在のURLを取得する関数
  const { replace } = useRouter(); // URLを更新することができる関数

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams); // URL作成
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
      replace(`${pathname}?${params.toString()}`); // 現在のURLに入力テキストをパラメータとして付与
    }
}
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()} // 再読み込みなどを行ったときにパラメータを失わないようにする。
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
