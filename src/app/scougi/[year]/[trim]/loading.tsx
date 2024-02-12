export default function Loading(){
  return (
    <div className="p-2">
      <div className="skeleton w-64 h-8"></div>
      <div className="mx-auto w-fit mt-2">
        <div className="skeleton w-[60vw] h-[80vh]"></div>
      </div>
    </div>
  )
}