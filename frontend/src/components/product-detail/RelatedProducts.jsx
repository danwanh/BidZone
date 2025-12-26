export const RelatedProducts = ({ relatedProducts }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm khác cùng chuyên mục</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {relatedProducts.slice(0, 5).map((p) => (
          <div key={p._id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <img
              src={p.image_url?.[0] || "/placeholder.svg"}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-sm mb-1 truncate">{p.name}</h3>
            <p className="text-indigo-600 font-bold">{p.current_price?.toLocaleString()} VNĐ</p>
          </div>
        ))}
      </div>
    </div>
  )
}
