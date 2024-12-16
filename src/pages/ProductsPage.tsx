import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import Logo from "@/assets/Logo.png";
import { RootState, AppDispatch } from "@/store/store";
import {
  AddProductAsync,
  GetUserProductsAsync,
  GenerateInvoiceAsync,
  reset,
} from "@/Slice/Product.Slice";
import { Logout } from "@/Slice/Auth.Slice";
import { TableSkeleton } from "@/components/TableSkeleton";

const AddProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { products, isLoading, isError, isSuccess, message, operationType } =
    useSelector((state: RootState) => state.products);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({
    productName: "",
    productPrice: "",
    quantity: "",
  });
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      productName: "",
      productPrice: "",
      quantity: "",
    };

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
      isValid = false;
    }

    if (!productPrice) {
      newErrors.productPrice = "Price is required";
      isValid = false;
    } else if (isNaN(Number(productPrice)) || Number(productPrice) <= 0) {
      newErrors.productPrice = "Please enter a valid price";
      isValid = false;
    }

    if (!quantity) {
      newErrors.quantity = "Quantity is required";
      isValid = false;
    } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    setProductsLoading(true);
    e.preventDefault();

    if (!validateForm()) return;

    const newProduct = {
      name: productName,
      price: Number(productPrice),
      quantity: Number(quantity),
    };

    dispatch(AddProductAsync(newProduct));
    setProductsLoading(false);

    // Clear form after submission
    setProductName("");
    setProductPrice("");
    setQuantity("");
  };

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

  const calculateSubTotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const calculateGST = () => {
    return calculateSubTotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateGST();
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
        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter the product name"
              className="bg-[#1F1F1F] border-[#333333] text-white"
            />
            {errors.productName && (
              <p className="text-red-500 text-sm">{errors.productName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productPrice">Product Price</Label>
            <Input
              id="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter the price"
              className="bg-[#1F1F1F] border-[#333333] text-white"
            />
            {errors.productPrice && (
              <p className="text-red-500 text-sm">{errors.productPrice}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter the Qty"
              className="bg-[#1F1F1F] border-[#333333] text-white"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>

          <div className="col-span-full flex justify-center mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#303030] text-[#CCF575] hover:bg-[#92d952] hover:text-black p-6"
            >
              {isLoading ? "Adding..." : "Add Product"}
              <PlusCircle className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Products Table */}
        <div className="rounded-xl border border-[#333333]">
          {productsLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <div className="rounded-xl border border-[#333333]">
              <Table className="rounded-xl bg-white/90">
                <TableHeader className="">
                  <TableRow className=" rounded-xl border-[#333333] ">
                    <TableHead className="text-black px-4 py-2">
                      Product name
                    </TableHead>
                    <TableHead className="text-black px-4 py-2">
                      Price
                    </TableHead>
                    <TableHead className="text-black px-4 py-2">
                      Quantity
                    </TableHead>
                    <TableHead className="text-black px-4 py-2">
                      Total Price
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-[#141414] ">
                  {products.map((product, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-[#1F1F1F]/50 border-[#333333]"
                    >
                      <TableCell className="px-4 py-2">
                        {product.name}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {product.price}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="text">
                        INR {product.price * product.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="hover:bg-[#1F1F1F]/50 border-[#333333]">
                    <TableCell colSpan={3} className="text-right font-medium">
                      Sub-Total
                    </TableCell>
                    <TableCell className="">
                      INR {calculateSubTotal().toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#1F1F1F]/50 border-[#333333]">
                    <TableCell colSpan={3} className="text-right font-medium">
                      Incl + GST 18%
                    </TableCell>
                    <TableCell className="">
                      INR {calculateTotal().toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>

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
