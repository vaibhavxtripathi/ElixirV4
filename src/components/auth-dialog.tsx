"use client";

import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import { GoogleIcon } from "@/icons/general";

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
  const queryClient = useQueryClient();

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
      // Update cache so Navbar updates instantly without refresh
      queryClient.setQueryData(["me"], me.data);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
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
  console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  async function handleGoogle() {
    try {
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
      const startUrl = `${
        api.defaults.baseURL
      }/auth/google/start?redirect=${encodeURIComponent(currentPath)}`;
      window.location.href = startUrl;
    } catch (e: unknown) {
      const error = e as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "Google sign-in failed"
      );
    }
  }

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto !rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md text-white">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center text-white text-lg">
              {mode === "signup" ? "Create account" : "Login"}
            </DialogTitle>
            <DialogDescription className="sm:text-center text-white/70 text-sm">
              {mode === "signup"
                ? "We just need a few details to get you started."
                : "Enter your credentials to log in."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 sm:space-y-5 mt-4">
          <Button
            onClick={handleGoogle}
            variant="gradientOutline"
            className="w-full rounded-lg text-sm"
          >
            <GoogleIcon className="w-4 h-4" />
            Continue with Google
          </Button>

          <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
            <span className="text-muted-foreground text-xs">Or</span>
          </div>
        </div>

        <form
          className="space-y-4 sm:space-y-5"
          onSubmit={
            mode === "login"
              ? loginForm.handleSubmit(onSubmit)
              : registerForm.handleSubmit(onSubmit)
          }
        >
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className=":not-first:mt-2">
                <Label htmlFor={`${id}-firstName`} className="text-sm">
                  First name
                </Label>
                <Input
                  id={`${id}-firstName`}
                  placeholder="Jane"
                  type="text"
                  required
                  className="rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/50 h-10 sm:h-11 text-sm"
                  {...registerForm.register("firstName")}
                />
              </div>
              <div className=":not-first:mt-2">
                <Label htmlFor={`${id}-lastName`} className="text-sm">
                  Last name
                </Label>
                <Input
                  id={`${id}-lastName`}
                  placeholder="Doe"
                  type="text"
                  required
                  className="rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/50 h-10 sm:h-11 text-sm"
                  {...registerForm.register("lastName")}
                />
              </div>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div className=":not-first:mt-2">
              <Label htmlFor={`${id}-email`} className="text-sm">
                Email
              </Label>
              <Input
                id={`${id}-email`}
                placeholder="Enter your email"
                type="email"
                required
                className="rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/50 h-10 sm:h-11 text-sm"
                {...(mode === "login"
                  ? loginForm.register("email")
                  : registerForm.register("email"))}
              />
            </div>
            <div className="relative">
              <Label htmlFor={`${id}-password`} className="text-sm">
                Password
              </Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                className="rounded-lg pr-10 border-white/15 bg-white/5 text-white placeholder:text-white/50 h-10 sm:h-11 text-sm"
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-red-500">{err}</p>}

          <Button
            type="submit"
            className="w-full rounded-lg text-sm"
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

        <div className="mt-2 text-center text-xs sm:text-sm text-muted-foreground">
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
