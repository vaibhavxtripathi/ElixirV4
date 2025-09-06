"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { setToken, roleToDashboard } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setErr(null);
    try {
      const res = await api.post("/auth/register", data);
      setToken(res.data.token);
      const me = await api.get("/auth/me");
      router.push(roleToDashboard(me.data.user?.role));
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </main>
  );
}
