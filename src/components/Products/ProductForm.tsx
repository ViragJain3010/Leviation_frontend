interface ProductFormProps {
    setProductsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AddProductAsync, GetUserProductsAsync } from "@/Slice/Product.Slice";
import { PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";

const ProductForm: React.FC<ProductFormProps> = ({ setProductsLoading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({
    productName: "",
    productPrice: "",
    quantity: "",
  });

  const { isLoading } = useSelector((state: RootState) => state.products);

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
    e.preventDefault();
    if (!validateForm()) return;
    setProductsLoading(true);

    const newProduct = {
      name: productName,
      price: Number(productPrice),
      quantity: Number(quantity),
    };

    dispatch(AddProductAsync(newProduct));
    dispatch(GetUserProductsAsync({ showToast: true })).then(() => {
      setProductsLoading(false);
    });
    // Clear form after submission
    setProductName("");
    setProductPrice("");
    setQuantity("");
  };

  return (
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity}</p>
        )}
      </div>

      <div className="col-span-full flex justify-center mt-4">
        <Button
          type="submit"
          className="bg-[#303030] text-[#CCF575] hover:bg-[#92d952] hover:text-black p-6"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Product"}
          <PlusCircle className="mr-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
