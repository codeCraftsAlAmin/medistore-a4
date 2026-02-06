"use client";

export async function updateProfileAction(formData: {
  id: string;
  name: string;
  email: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me/${formData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        error: {
          message: result.message || "Failed to update profile",
        },
      };
    }

    return { data: result.data, error: null };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Something went wrong",
      },
    };
  }
}
