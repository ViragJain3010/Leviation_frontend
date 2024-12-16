export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="flex mb-4">
          {Array(columns).fill(0).map((_, j) => (
            <div key={j} className="h-8 bg-gray-200 rounded mr-2 flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
  