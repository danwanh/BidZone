import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const CategoryDetail = ({
  category,
  categories,
  updateAction,
  deleteAction,
}) => {
  const [isParent, setIsParent] = useState(false);
  const [parentName, setParentName] = useState("");
  const [childCategory, setChildCategory] = useState(0);
  const [bidding, setBidding] = useState(0);
  const [sold, setSold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const parent = categories.filter(
    (c) => c.category_id === null || !c?.category_id
  );

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorUpdate },
    reset,
  } = useForm();

  const onSubmitUpdate = async (data) => {
    console.log("Form submitted", data);
    try {
      const response = await api.patch(`api/category/${category._id}`, data);
      toast.success("Success! Updated category.");
      setEditing(false);
      updateAction();
    } catch (err) {
      console.error(err.response?.data?.message || err);
    }
  };

  const onUpdateNoCategory = () => {
    alert.error("No category selected.");
  };

  const handleDelete = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      const res = await api.delete(`api/category/${category._id}`);
      deleteAction();
      toast.success("Đã xóa danh mục!");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message === "Can't delete category with products") {
        toast.error(
          "That category already has products under it. Can't delete"
        );
      }
      console.log(message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setEditing(false);
    if (category.category_id) {
      try {
        const getParent = async () => {
          const response = await api.get(
            `/api/category/${category.category_id}`
          );
          reset({
            name: category.name,
            category_id: category.category_id,
          });
          setParentName(response?.data?.name);
        };
        getParent();
      } catch (err) {
        toast.error(err.message || "Lỗi tìm thông tin danh mục");
      }
      setIsParent(false);
    } else {
      const getChild = async () => {
        if (category?._id) {
          try {
            const response = await api.get(
              `/api/category/subcategories/${category._id}`
            );
            setChildCategory(response.data?.categories?.length);
          } catch (err) {
            toast.error(err.message || "Lỗi tìm thông tin danh mục");
          }
        }
      };
      getChild();
      setIsParent(true);
    }
    const getBidding = async () => {
      if (category?._id) {
        try {
          const response = await api.get(
            `/api/product/by-category/simple/${category?._id}?status=active`
          );
          setBidding(response.data?.length);
        } catch (err) {
          toast.error(err.message || "Lỗi tìm thông tin danh mục");
        }
      } else {
        setLoading(false);
      }
    };
    getBidding();

    const getSold = async () => {
      if (category?._id) {
        try {
          setLoading(true);
          const response = await api.get(
            `/api/product/by-category/simple/${category?._id}?status=ended`
          );
          setSold(response.data?.length);
        } catch (err) {
          toast.error(err.message || "Lỗi tìm thông tin danh mục");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getSold();
  }, [category]);

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg transition-h duration-300 ease-in-out">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Chi tiết danh mục
      </h3>
      <h4 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        {editing && (
          <input
            {...registerUpdate("name")}
            placeholder={category.name}
            type="text"
            className="text-center w-full ring-1 ring-gray-500 ring-inset. rounded-md py-2.5"
          />
        )}
        {loading && (
          <div className="flex justify-center w-full">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
          </div>
        )}
        {!loading && !editing && <p className="py-2.5">{category.name}</p>}
      </h4>
      <form
        className="flex flex-col gap-2.5"
        onSubmit={handleSubmitUpdate(onSubmitUpdate)}
      >
        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600 font-medium">ID</span>
          <span className="text-gray-800">{loading ? "" : category._id}</span>
        </div>

        {!isParent && (
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600 font-medium">Danh mục cha</span>

            {editing && (
              <select
                {...registerUpdate("category_id")}
                className="font-semibold text-gray-800 !rounded-sm ring ring-inset ring-gray-500"
              >
                <option value="">---</option>

                {parent.map((n, index) => (
                  <option key={index} value={n._id}>
                    {n.name}
                  </option>
                ))}
              </select>
            )}
            {!editing && (
              <span className="font-semibold text-gray-800">
                {loading ? "" : parentName}
              </span>
            )}
          </div>
        )}

        {isParent && (
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600 font-medium">Số danh mục con</span>
            <span className="font-semibold text-gray-800">
              {loading ? "" : childCategory}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600 font-medium">
            Số sản phẩm đang đấu giá
          </span>
          <span className="font-semibold text-gray-800">
            {loading ? "" : bidding}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600 font-medium">Số sản phẩm đã bán</span>
          <span className="font-semibold text-gray-800">
            {loading ? "" : sold}
          </span>
        </div>

        {editing && (
          <div className="flex gap-5">
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 font-bold cursor-pointer"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="w-full mt-4 px-4 py-3 ring ring-2 ring-inset  ring-indigo-500 text-indigo-500 rounded-lg hover:ring-indigo-700 font-bold cursor-pointer"
            >
              Hủy
            </button>
          </div>
        )}
        {!editing && (
          <div className="flex gap-5">
            <button
              onClick={handleDelete}
              type="button"
              className="w-full mt-4 px-4 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 font-bold cursor-pointer"
            >
              {deleting ? "Đang xóa" : "XÓA"}
            </button>
            <button
              type="button"
              onClick={
                category?._id
                  ? () => setEditing(true)
                  : () => onUpdateNoCategory()
              }
              className="w-full mt-4 px-4 py-3 ring ring-2 ring-inset ring-indigo-500 text-indigo-500 rounded-lg hover:ring-indigo-700 font-bold cursor-pointer"
            >
              Thay đổi
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CategoryDetail;
