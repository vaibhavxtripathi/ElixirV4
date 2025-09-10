"use client";
import AuthDialog from "@/components/auth-dialog";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <AuthDialog defaultMode="signup" openOnMount onCloseNavigateTo="/" />
    </main>
  );
}
