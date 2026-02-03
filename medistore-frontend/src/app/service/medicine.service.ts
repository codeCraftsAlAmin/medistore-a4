import { env } from "@/types/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

export type Medicine = {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: { name: string };
  _count?: { reviews: number };
};

export type MedicinesListResponse = {
  ok: boolean;
  message: string;
  data: {
    data: Medicine[];
    paginations: {
      page: number;
      limit: number;
      totalMedicine: number;
      totalPage: number;
    };
  };
};

export const medicineService = {
  getAllMedicines: async function (filters?: any) {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });
      }

      const queryString = queryParams.toString();
      const url = `${BACKEND_URL}/api/medicine${queryString ? `?${queryString}` : ""}`;

      const cookieStore = await cookies();
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const response = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: response.message || `HTTP error: ${res.status}` },
        };
      }

      return { data: response.data, error: null };
    } catch (error) {
      console.error("Get medicines error:", error);
      return {
        data: null,
        error: {
          message:
            error instanceof Error ? error.message : "Something went wrong",
        },
      };
    }
  },

  getMedicineById: async function (id: string) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/medicine/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });
      const response = await res.json();
      return res.ok
        ? { data: response.data, error: null }
        : { data: null, error: response };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch" } };
    }
  },

  createMedicine: async function (payload: any) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/medicine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      return res.ok
        ? { data: response.data, error: null }
        : { data: null, error: response };
    } catch (error) {
      return { data: null, error: { message: "Failed to create medicine" } };
    }
  },

  getCategories: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/categories/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorResponse = await res
          .json()
          .catch(() => ({ message: `HTTP error: ${res.status}` }));
        return {
          data: null,
          error: errorResponse.message || `HTTP error: ${res.status}`,
        };
      }

      const response = await res.json();

      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.error("Category Fetch Error:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  },

  updateMedicine: async function (medicineId: string, payload: any) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/medicine/${medicineId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      return res.ok
        ? { data: response.data, error: null }
        : { data: null, error: response };
    } catch (error: any) {
      return {
        data: null,
        error: { message: "Service Error: " + error.message },
      };
    }
  },

  deleteMedicine: async function (medicineId: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medicine/${medicineId}`,
        {
          method: "DELETE",
          headers: {
            Cookie: cookieStore.toString(), // Passes session for authentication(UserRole.SELLER)
          },
        },
      );

      const response = await res.json();
      return res.ok
        ? { data: response.data, error: null }
        : { data: null, error: response };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Deletion failed" },
      };
    }
  },

  createCategory: async function (name: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/category/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ name }),
      });

      const response = await res.json();
      return res.ok
        ? { success: true, data: response.data }
        : { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "Failed to create category" };
    }
  },

  updateCategory: async function (id: string, name: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ name }),
      });

      const response = await res.json();
      return res.ok
        ? { success: true, data: response.data }
        : { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "Failed to update category" };
    }
  },

  deleteCategory: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/category/${id}`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const response = await res.json();
      return res.ok
        ? { success: true, data: response.data }
        : { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "Failed to delete category" };
    }
  },
};
