export const YearShelf = (props: { year: string, trims: number[] }) => {
  return (
    <div className="border-1 border-gray-200 flex">
      <div className="bg-gray-200 p-2">
        <p>{props.year}</p>
      </div>
    </div>
  )
}
