"use client";

import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { setToken, roleToDashboard } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type LoginData = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});
type RegisterData = z.infer<typeof registerSchema>;

export interface AuthDialogProps {
  defaultMode?: "signup" | "login";
  trigger?: React.ReactNode | null;
  openOnMount?: boolean;
  onCloseNavigateTo?: string;
}

export default function AuthDialog({
  defaultMode = "signup",
  trigger,
  openOnMount = false,
  onCloseNavigateTo,
}: AuthDialogProps) {
  const [mode, setMode] = useState<"signup" | "login">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(openOnMount);
  const [err, setErr] = useState<string | null>(null);
  const id = useId();
  const router = useRouter();

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const toggleMode = () => {
    setErr(null);
    setMode(mode === "signup" ? "login" : "signup");
  };
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginData | RegisterData) => {
    setErr(null);
    try {
      console.log("Attempting auth with:", {
        mode,
        data,
        baseURL: api.defaults.baseURL,
      });

      if (mode === "login") {
        const res = await api.post("/auth/login", data as LoginData);
        console.log("Login response:", res.data);
        setToken(res.data.token);
      } else {
        const res = await api.post("/auth/register", data as RegisterData);
        console.log("Register response:", res.data);
        setToken(res.data.token);
      }
      const me = await api.get("/auth/me");
      console.log("Me response:", me.data);
      setOpen(false);
      router.push(roleToDashboard(me.data.user?.role));
    } catch (e: unknown) {
      console.error("Auth error:", e);
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
        message?: string;
        code?: string;
      };
      setErr(
        maybeAxiosError.response?.data?.message ||
          maybeAxiosError.message ||
          (mode === "login" ? "Login failed" : "Registration failed")
      );
    }
  };

  const isSubmitting =
    mode === "login"
      ? loginForm.formState.isSubmitting
      : registerForm.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setMode(defaultMode);
        if (!o && onCloseNavigateTo) router.push(onCloseNavigateTo);
      }}
    >
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md !rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md text-white">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center text-white">
              {mode === "signup" ? "Create account" : "Login"}
            </DialogTitle>
            <DialogDescription className="sm:text-center text-white/70">
              {mode === "signup"
                ? "We just need a few details to get you started."
                : "Enter your credentials to log in."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-4"
          onSubmit={
            mode === "login"
              ? loginForm.handleSubmit(onSubmit)
              : registerForm.handleSubmit(onSubmit)
          }
        >
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className=":not-first:mt-2">
                <Label htmlFor={`${id}-firstName`}>First name</Label>
                <Input
                  id={`${id}-firstName`}
                  placeholder="Jane"
                  type="text"
                  required
                  className="rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/50"
                  {...registerForm.register("firstName")}
                />
              </div>
              <div className=":not-first:mt-2">
                <Label htmlFor={`${id}-lastName`}>Last name</Label>
                <Input
                  id={`${id}-lastName`}
                  placeholder="Doe"
                  type="text"
                  required
                  className="rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/50"
                  {...registerForm.register("lastName")}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className=":not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="Enter your email"
                type="email"
                required
                className="rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/50"
                {...(mode === "login"
                  ? loginForm.register("email")
                  : registerForm.register("email"))}
              />
            </div>
            <div className="relative">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                className="rounded-lg pr-10 border-white/15 bg-white/5 text-white placeholder:text-white/50"
                {...(mode === "login"
                  ? loginForm.register("password")
                  : registerForm.register("password"))}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-[38px] text-white/70"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-red-500">{err}</p>}

          <Button
            type="submit"
            className="w-full rounded-lg"
            variant="gradientOutline"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "signup"
                ? "Creating..."
                : "Signing in..."
              : mode === "signup"
              ? "Create account"
              : "Login"}
          </Button>
        </form>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button className="underline" onClick={toggleMode}>
                Login
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button className="underline" onClick={toggleMode}>
                Sign Up
              </button>
            </>
          )}
        </div>

        {mode === "signup" && (
          <>
            <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1 my-4">
              <span className="text-muted-foreground text-xs">Or</span>
            </div>
            <Button variant="gradientOutline" className="w-full rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-4 w-4"
                aria-hidden
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.602 31.91 29.197 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.642 5.1 28.982 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.381 16.108 18.824 13 24 13c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.642 5.1 28.982 3 24 3 16.318 3 9.706 7.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 43c5.137 0 9.739-1.97 13.213-5.178l-6.095-5.154C29.07 34.091 26.666 35 24 35c-5.176 0-9.582-3.09-11.302-7.417l-6.55 5.044C9.57 40.569 16.318 43 24 43z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.021 2.853-3.107 5.237-5.89 6.668l6.095 5.154C38.564 36.65 41 30.5 41 23c0-1.341-.138-2.651-.389-3.917z"
                />
              </svg>
              Continue with Google
            </Button>
            <p className="text-muted-foreground text-center text-xs mt-2">
              By signing up you agree to our{" "}
              <a className="underline hover:no-underline" href="#">
                Terms
              </a>
              .
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
