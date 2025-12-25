import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../../api/axios";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  category_id: z.string().optional(),
});

const AddCategory = ({ setAdd, parentCategory, updateAction }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const body = {
        name: data.name,
        slug: data.name,
        category_id: data.category_id,
      };
      console.log("Form submitted", body);
      const response = await api.post("api/category", body);
      console.log(response.data);
      toast.success("Success! Added category.");
      setAdd(false);
      updateAction();
      reset({
        name: "",
        category_id: "",
      });
    } catch (err) {
      console.error(err.response?.data?.message || err);
    }
  };

  const onError = (errors) => {
    // Loop through errors and show toast
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="bg-white/65 backdrop-blur absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4 shadow-lg flex flex-col gap-5 items-center"
    >
      <p className="text-[18px] text-blue-500 font-bold">Tạo danh mục mới</p>
      <input
        type="text"
        placeholder="Tên danh mục"
        {...register("name")}
        className="w-full px-2 border-b border-black my-2 focus:outline-none "
      />
      <select
        {...register("category_id")}
        className="w-full px-2 border-b border-black my-5 pb-2 !rounded-none focus:outline-none "
      >
        <option value={""}>Không có danh mục cha</option>
        {parentCategory.map((n, index) => (
          <option key={index} value={n._id}>
            {n.name}
          </option>
        ))}
      </select>
      <div className="flex gap-5 font-bold">
        <button
          type="submit"
          className="w-2/3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:-translate-y-1 transition-all duration-85 cursor-pointer whitespace-nowrap"
        >
          Tạo danh mục
        </button>
        <button
          type="button"
          onClick={() => setAdd(false)}
          className="w-1/3 px-4 py-2 ring ring-inset ring-black text-black rounded-lg hover:-translate-y-1 transition-all duration-85 ease-in-out cursor-pointer"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AddCategory;
