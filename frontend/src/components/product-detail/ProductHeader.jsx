"use client"

export const ProductHeader = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="mb-4 inline-block px-4 py-2 border-2 border-indigo-500 text-indigo-500 rounded-full bg-white hover:bg-indigo-500 hover:text-white transition"
    >
      ← Quay lại
    </button>
  )
}
