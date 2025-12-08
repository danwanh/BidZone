import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const handlePageChange = (pageNumber) => {
    if (pageNumber === "...") return; // ignore dots

    const next = new URLSearchParams(searchParams);
    next.set("page", pageNumber);
    setSearchParams(next);
  };

  const getPages = () => {
    const pages = [];
    const total = totalPage;
    const current = page;
    const delta = 2; // how many numbers around current page

    let left = current - delta;
    let right = current + delta;

    // Fix window if near start
    if (left < 1) {
      right += 1 - left;
      left = 1;
    }

    // Fix window if near end
    if (right > total) {
      left -= right - total;
      right = total;
    }

    left = Math.max(1, left);

    // Always include first page
    if (left > 1) pages.push(1);

    // Add ellipsis before main range
    if (left > 2) pages.push("...");

    // Main range
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Ellipsis after main range
    if (right < total - 1) pages.push("...");

    // Always include last page
    if (right < total) pages.push(total);

    return pages;
  };

  return (
    <div className="flex gap-5 mt-5">
      {totalPage > 1 &&
        getPages().map((num, i) => (
          <div
            key={i}
            onClick={() => handlePageChange(num)}
            className={`py-2 px-4 rounded-xl cursor-pointer transition-all duration-200 
              ${
                num === "..."
                  ? "opacity-50 cursor-default"
                  : "hover:-translate-y-2"
              }
              ${page === num ? "text-white bg-[#667EEA]" : "text-[#666666]"}
            `}
          >
            {num}
          </div>
        ))}
    </div>
  );
};

export default Pagination;
