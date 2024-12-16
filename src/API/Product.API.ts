export interface Product {
  name: string;
  price: number;
  quantity: number;
}

interface ProductResponse {
  data: Product[];
}

export function addProduct(productData: Product, token: string): Promise<ProductResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        resolve({ data });
      } else {
        reject({ message: data.message || "Failed to add product" });
      }
    } catch (err) {
      reject({ err: err, message: "Network error" });
    }
  });
}

export function generateInvoice(token: string): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/invoice/generate`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        resolve(blob);
      } else {
        const errorData = await response.json();
        reject({ message: errorData.message || "Failed to generate invoice" });
      }
    } catch (err) {
      reject({ err: err, message: "Network error" });
    }
  });
}

export function getUserProducts(token: string): Promise<ProductResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        resolve({ data });
      } else {
        reject({ message: data.message || "Failed to fetch products" });
      }
    } catch (err) {
      reject({ err: err, message: "Network error" });
    }
  });
}