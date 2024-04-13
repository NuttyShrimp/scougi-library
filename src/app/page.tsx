import { ScougiList, ScougiListSkeleton } from "@/components/ScougiList";
import Image from "next/image";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="w-screen">
      <div className="flex flex-col items-center sm:items-start container bg-zinc-400 mx-auto px-20 py-2 not-prose">
        <Image src="/scougi.png" alt="Scougi" width={128} height={32} className="w-32" />
        <div className="flex flex-row items-center">
          <p className="text-gray-100">by</p>
          <Image src="/logo.png" alt="Scouts & Gidsen Asse" width={48} height={48} className="h-12" />
        </div>
      </div>
      <Suspense fallback={<ScougiListSkeleton />}>
        <ScougiList />
      </Suspense>
    </div>
  )
}
