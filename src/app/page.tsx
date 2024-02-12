import { ScougiList } from "@/components/ScougiList";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Page() {
  return (
    <div className="w-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-3">
          Scougi - Scouts en Gidsen Asse
        </h1>
        <h3 className="mt-3">Lees hier uw favoriete trimestriële blad!</h3>
      </div>
      <Suspense fallback={<Loading />}>
        <ScougiList />
      </Suspense>
    </div>
  )
}
