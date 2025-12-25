import { useState, useEffect, useMemo } from "react";
import SubCategoryList from "./SubcategoryList";
import AddCategory from "./AddCategory";

const CategoryList = ({ setSelected, categories, updateAction }) => {
  const [parentCategory, setParentCategory] = useState([]);

  useEffect(() => {
    const filtered = categories.filter(
      (c) => c.category_id === null || !c?.category_id
    );

    setParentCategory(filtered);
  }, [categories]);
  const [add, setAdd] = useState(false);

  function generateNiceColors(n) {
    const colors = [];
    if (n <= 0) return colors;
    if (n === 1) return ["#6FA8DC"];

    for (let i = 0; i < n; i++) {
      const hue = Math.round((360 / n) * i);
      const sat = 65;
      const light = 80;
      colors.push(hslToHex(hue, sat, light));
    }

    return colors;
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return (
      "#" +
      [f(0), f(8), f(4)]
        .map((x) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
        .toUpperCase()
    );
  }

  const colors = generateNiceColors(parentCategory.length);

  return (
    <div className="relative">
      {add && (
        <div className="absolute inset-0 z-5 bg-[#00000050] h-full rounded-2xl">
          <AddCategory
            setAdd={setAdd}
            parentCategory={parentCategory}
            updateAction={updateAction}
          />
        </div>
      )}
      <section className="md:col-span-3 space-y-6">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Danh sách các danh mục:
          </h2>
          <button
            onClick={() => setAdd(true)}
            className="absolute select-none hover:bg-indigo-500 top-6 right-6 cursor-pointer text-3xl text-bold bg-indigo-400 px-2.5 rounded-lg text-white"
          >
            +
          </button>

          <div className=" h-120 overflow-y-scroll">
            <table className="w-full border-collapse mt-4 overflow-y-scroll">
              <thead>
                <tr className="border-b-2 border-gray-800 text-left font-semibold text-gray-600">
                  <th className="text-left p-3 font-semibold">Danh mục cha</th>
                  <th className="text-center p-3 font-semibold">
                    Danh mục con
                  </th>
                </tr>
              </thead>
              <tbody>
                {parentCategory.map((pc, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td>
                      <button
                        onClick={() => setSelected(pc)}
                        className="p-3 align-top font-medium w-fit cursor-pointer"
                      >
                        {pc.name}
                      </button>
                    </td>
                    <td className="p-3 w-2/3">
                      <div className="flex flex-wrap justify-center gap-2">
                        <SubCategoryList
                          id={pc._id}
                          color={colors[index]}
                          setSelected={setSelected}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryList;
