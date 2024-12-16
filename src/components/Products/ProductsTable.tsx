import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { TableSkeleton } from "@/components/TableSkeleton";
  
  interface ProductsTableProps {
    products: Array<{ name: string; price: number; quantity: number }>;
    productsLoading: boolean;
  }
  
  const ProductsTable: React.FC<ProductsTableProps> = ({ products, productsLoading }) => {
    const calculateSubTotal = () => products.reduce((total, p) => total + p.price * p.quantity, 0);
    const calculateGST = () => calculateSubTotal() * 0.18;
    const calculateTotal = () => calculateSubTotal() + calculateGST();
  
    if (productsLoading) return <TableSkeleton rows={5} columns={4} />;
  
    return (
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
    );
  };
  
  export default ProductsTable;
  