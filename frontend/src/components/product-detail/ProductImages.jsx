"use client"

export const ProductImages = ({
  mainImage,
  setMainImage,
  thumbnails,
  product,
  isWatchlisted,
  watchlistLoading,
  onToggleWatchlist,
  userRole,
}) => {
  return (
    <div>
      <div className="relative mb-4">
        <div className="flex items-center justify-center overflow-hidden">
          <img
            src={mainImage || "/placeholder.svg?height=480&width=480"}
            alt={product.name}
            className="w-full h-full aspect-square object-cover rounded-xl border-2 border-gray-200"
          />
          {userRole === "bidder" && (
            <button
              onClick={onToggleWatchlist}
              disabled={watchlistLoading}
              className="absolute top-4 left-2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isWatchlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className={`transition ${isWatchlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {thumbnails.slice(0, 4).map((t, i) => (
          <button
            key={i}
            onClick={() => setMainImage(t)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
              mainImage === t ? "border-indigo-500 ring-2 ring-indigo-300" : "border-gray-300 hover:border-indigo-300"
            }`}
          >
            <img
              src={t || "/placeholder.svg?height=120&width=120"}
              alt={`${product.name} ${i}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
