import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

const AdminNavBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "Danh mục";

  const getLabelURL = (label) => {
    const url = new URLSearchParams();
    url.set("tab", label);
    return `?${url.toString()}`;
  };

  const menuItems = [
    {
      id: "categories",
      label: "Danh mục",
      icon: (
        <svg
          width={23}
          height={23}
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.1625 7.64168L9.50833 0.554177C9.625 0.359733 9.77083 0.218566 9.94583 0.130677C10.1208 0.042788 10.3056 -0.000767544 10.5 1.02339e-05C10.6944 0.000788012 10.8792 0.0447326 11.0542 0.131844C11.2292 0.218955 11.375 0.359733 11.4917 0.554177L15.8375 7.64168C15.9542 7.83612 16.0125 8.04029 16.0125 8.25418C16.0125 8.46807 15.9639 8.66251 15.8667 8.83751C15.7694 9.01251 15.6333 9.15368 15.4583 9.26101C15.2833 9.36834 15.0792 9.42162 14.8458 9.42084H6.15417C5.92083 9.42084 5.71667 9.36757 5.54167 9.26101C5.36667 9.15445 5.23056 9.01329 5.13333 8.83751C5.03611 8.66173 4.9875 8.46729 4.9875 8.25418C4.9875 8.04107 5.04583 7.8369 5.1625 7.64168ZM16.9167 22.2542C15.4583 22.2542 14.2189 21.744 13.1985 20.7235C12.1781 19.7031 11.6674 18.4633 11.6667 17.0042C11.6659 15.5451 12.1765 14.3057 13.1985 13.286C14.2205 12.2663 15.4599 11.7557 16.9167 11.7542C18.3734 11.7526 19.6132 12.2632 20.636 13.286C21.6588 14.3088 22.169 15.5482 22.1667 17.0042C22.1643 18.4602 21.6541 19.7 20.636 20.7235C19.6179 21.7471 18.3781 22.2573 16.9167 22.2542ZM0 20.5042V13.5042C0 13.1736 0.112 12.8967 0.336 12.6735C0.56 12.4503 0.836889 12.3383 1.16667 12.3375H8.16667C8.49722 12.3375 8.7745 12.4495 8.9985 12.6735C9.2225 12.8975 9.33411 13.1744 9.33333 13.5042V20.5042C9.33333 20.8347 9.22133 21.112 8.99733 21.336C8.77333 21.56 8.49644 21.6716 8.16667 21.6708H1.16667C0.836111 21.6708 0.559222 21.5588 0.336 21.3348C0.112778 21.1108 0.000777778 20.834 0 20.5042Z"
            fill={tab == "Danh mục" ? "#FFFFFF" : "#404040"}
          />
        </svg>
      ),
    },
    {
      id: "users",
      label: "Người dùng",
      icon: (
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z"
            fill={tab == "Người dùng" ? "#FFFFFF" : "#404040"}
          />
        </svg>
      ),
    },
    {
      id: "upgrade",
      label: "Nâng cấp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
        >
          <path
            fill={tab == "Nâng cấp" ? "#FFFFFF" : "#404040"}
            stroke={tab == "Nâng cấp" ? "#FFFFFF" : "#404040"}
            fillRule="evenodd"
            d="M15.668 7a.75.75 0 0 1 .75-.75H22a.75.75 0 0 1 .75.75v5.546a.75.75 0 0 1-1.5 0V8.803L15.114 14.9c-.469.466-.873.868-1.24 1.147c-.394.298-.83.524-1.369.524c-.538 0-.975-.226-1.369-.525c-.367-.278-.77-.68-1.24-1.146l-.274-.273c-.514-.511-.847-.84-1.125-1.051c-.26-.198-.382-.22-.463-.22c-.08 0-.202.023-.462.22c-.277.211-.61.54-1.124 1.052L2.529 18.53a.75.75 0 0 1-1.058-1.062l3.953-3.938c.47-.466.873-.869 1.24-1.148c.394-.3.831-.525 1.37-.526c.539 0 .976.226 1.37.525c.367.279.771.681 1.24 1.148l.275.272c.514.511.847.84 1.124 1.05c.26.198.382.22.462.22s.202-.022.462-.22c.278-.21.61-.539 1.125-1.05l6.09-6.052h-3.764a.75.75 0 0 1-.75-.75"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: (
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 7L12 2L2 7V17L12 22L22 17V7Z"
            stroke={tab == "Sản phẩm" ? "#FFFFFF" : "#404040"}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path
            d="M2 7L12 12M12 12V22M12 12L22 7M17 4.5L7 9.5"
            stroke={tab == "Sản phẩm" ? "#FFFFFF" : "#404040"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      id: "variables",
      label: "Biến toàn cục",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
        >
          <g
            fill={tab == "Biến toàn cục" ? "#FFFFFF" : "#404040"}
            stroke={tab == "Biến toàn cục" ? "#FFFFFF" : "#404040"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <rect width={4} height={6} x={14} y={14} rx={2} />
            <rect width={4} height={6} x={6} y={4} rx={2} />
            <path d="M6 20h4m4-10h4M6 14h2v6m6-16h2v6" />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full flex md:flex-col md:w-53 h-100% bg-[rgba(154,66,66,0.65)] text-white shrink-0 overflow-x-scroll md:overflow-x-auto">
      {/* Header */}
      <div className="md:py-4 md:px-6 ">
        <div className="items-center gap-2 hidden md:flex">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9999 38.3332C10.7383 36.2748 3.33325 27.5365 3.33325 18.3332V8.33317L19.9999 1.6665L36.6666 8.33317V18.3332C36.6666 27.5398 29.2616 36.2748 19.9999 38.3332ZM6.66659 9.99984V18.3332C6.76183 22.1867 8.11719 25.9029 10.5252 28.9129C12.9332 31.923 16.2613 34.061 19.9999 34.9998C23.7386 34.061 27.0666 31.923 29.4746 28.9129C31.8826 25.9029 33.238 22.1867 33.3333 18.3332V9.99984L19.9999 4.99984L6.66659 9.99984Z"
              fill="white"
              stroke="white"
            />
            <path
              d="M19.9999 18.3333C22.3011 18.3333 24.1666 16.4679 24.1666 14.1667C24.1666 11.8655 22.3011 10 19.9999 10C17.6987 10 15.8333 11.8655 15.8333 14.1667C15.8333 16.4679 17.6987 18.3333 19.9999 18.3333Z"
              fill="white"
            />
            <path
              d="M11.6667 25C12.488 26.4972 13.6924 27.7493 15.1567 28.6278C16.621 29.5064 18.2925 29.98 20.0001 30C21.7076 29.98 23.3792 29.5064 24.8435 28.6278C26.3078 27.7493 27.5122 26.4972 28.3334 25C28.2917 21.84 22.7634 20 20.0001 20C17.2217 20 11.7084 21.84 11.6667 25Z"
              fill="white"
            />
          </svg>

          <h1 className="text-xl font-semibold ">Bảng admin</h1>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="py-2 flex flex-row md:flex-col">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={getLabelURL(item.label)}
            className={`w-full px-3 py-1 md:px-6 md:py-3 flex items-center gap-1 md:gap-3 cursor-pointer whitespace-nowrap rounded-md md:rounded-none ${
              tab === item.label
                ? "bg-[#523232af] md:border-l-4 border-white text-white"
                : "hover:bg-[#5f363644] md:hover:border-l-1 hover:border-white text-[#404040]"
            }`}
          >
            {item.icon}
            <span className="font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavBar;
