import { useSearchParams } from "react-router-dom";

const SortBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";

  const updateSort = (nextSortBy, nextOrder) => {
    const params = new URLSearchParams(searchParams);

    if (nextSortBy) params.set("sortBy", nextSortBy);
    else params.delete("sortBy");

    if (nextOrder) params.set("order", nextOrder);
    else params.delete("order");

    params.set("page", 1);
    setSearchParams(params);
  };

  return (
    <div className="flex gap-3 items-center">
      {/* SORT BY */}
      <select
        value={sortBy}
        onChange={(e) => updateSort(e.target.value, order)}
        className="border px-3 py-1 rounded"
      >
        <option value="">Sắp xếp theo</option>
        <option value="price">Giá</option>
        <option value="endtime">Thời gian kết thúc</option>
      </select>

      {/* ORDER */}
      <select
        value={order}
        onChange={(e) => updateSort(sortBy, e.target.value)}
        className="border px-3 py-1 rounded"
        disabled={!sortBy}
      >
        <option value="">Thứ tự</option>
        <option value="asc">Tăng dần</option>
        <option value="desc">Giảm dần</option>
      </select>
    </div>
  );
};

export default SortBar;
