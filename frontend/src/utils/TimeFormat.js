export const maskName = (name) => {
  if (!name) return "Ẩn danh"
  if (name.length <= 5) return name
  const visible = name.slice(-5)
  const masked = "*".repeat(name.length - 5)
  return masked + visible
}

export const formatRelativeTime = (date) => {
  const now = new Date()
  const diff = new Date(date) - now
  if (diff <= 0) return "Đã kết thúc"
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} ngày nữa`
  if (hours > 0) return `${hours} giờ nữa`
  if (minutes > 0) return `${minutes} phút nữa`
  return `${seconds} giây nữa`
}

export const formatPostedTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return "vừa mới"
}

export const formatCountdown = (diff) => {
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}
