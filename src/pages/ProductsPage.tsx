import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Logo from "@/assets/Logo.png";
import { RootState, AppDispatch } from "@/store/store";
import {
  GetUserProductsAsync,
  GenerateInvoiceAsync,
  reset,
} from "@/Slice/Product.Slice";
import { Logout } from "@/Slice/Auth.Slice";
import ProductForm from "@/components/Products/ProductForm";
import ProductsTable from "@/components/Products/ProductsTable";

const AddProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { products, isLoading, isError, isSuccess, message, operationType } =
    useSelector((state: RootState) => state.products);

  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    setProductsLoading(true);
    dispatch(GetUserProductsAsync({ showToast: false })).then(() =>
      setProductsLoading(false)
    );
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }

    if (isSuccess) {
      switch (operationType) {
        case "add":
          toast({
            title: "Success",
            description: "Product added successfully",
          });
          break;
        case "invoice":
          toast({
            title: "Success",
            description: "Invoice generated successfully",
          });
          break;
      }
    }

    // Reset state after handling
    dispatch(reset());
  }, [isError, isSuccess, message, operationType, dispatch]);

  const handleLogout = () => {
    toast({
      title: "Success",
      description: "Logged out successfully",
    });

    dispatch(Logout()); // Set the logout flag and clear the token
    navigate("/login"); // Navigate to login page
  };

  const handleGenerateInvoice = () => {
    dispatch(GenerateInvoiceAsync());
  };

  return (
    <div className="w-full min-h-screen bg-[#141414] text-white font-sans relative overflow-hidden">
      <div className="absolute top-[-30px] left-[40%] w-[400px] h-[400px] rounded-full bg-[#4F59A8] opacity-20 blur-[80px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex bg-[#1F1F1F] justify-between items-center px-8 py-4">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="" />
        </div>
        <Button
          onClick={handleLogout}
          className="bg-[#CCF575] text-black hover:bg-[#92d952]"
        >
          Logout
        </Button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-semibold mb-2">Add Products</h1>
          <p className="text-[#AAAAAA] text-lg">
            This is basic login page which is used for levitation assignment
            purpose.
          </p>
        </div>

        {/* Add Product Form */}
        <ProductForm setProductsLoading={setProductsLoading}/>

        {/* Products Table */}
        <ProductsTable products={products} productsLoading={productsLoading} />

        {/* Generate Invoice Button */}
        <div className="mt-8 flex justify-center">
          <Button
            className="bg-[#303030] text-[#CCF575] hover:bg-[#92d952] hover:text-black px-24 py-6"
            onClick={handleGenerateInvoice}
            disabled={isLoading || products.length === 0}
          >
            {isLoading ? "Generating..." : "Generate PDF Invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
