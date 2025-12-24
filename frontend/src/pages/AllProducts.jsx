import ProductList from "../components/allProducts/ProductList";

export const AllProducts = () => {

  return (
    <>
    <section className="flex-col flex rounded-md px-10 py-10 bg-white md:col-span-3 space-y-6 mt-[60vh] min-h-[486px]">
        <ProductList />
    </section>
    </>
  );
};
