export default function Loading() {
  return (
    <div className="mx-auto container flex flex-col gap-2 items-center">
      <div className="skeleton w-32 h-8"></div>
      <div className="flex justify-evenly gap-4 w-full">
        <div className="skeleton w-16 h-24"></div>
        <div className="skeleton w-16 h-24"></div>
        <div className="skeleton w-16 h-24"></div>
        <div className="skeleton w-16 h-24"></div>

      </div>
    </div>
  )
}