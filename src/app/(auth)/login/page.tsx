"use client";
import AuthDialog from "@/components/auth-dialog";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <AuthDialog defaultMode="login" openOnMount onCloseNavigateTo="/" />
    </main>
  );
}
