"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/auth-actions";
import { Loader2, Heart } from "lucide-react";

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 ring-1 ring-sand-light/50">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light text-white shadow-sm">
              <Heart className="h-7 w-7 fill-current" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-text-main">
              Zelare
            </span>
          </div>

        <h1 className="text-2xl font-bold text-center text-text-main mb-6">
          Acesso Administrativo
        </h1>

        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-main mb-1"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center rounded-xl bg-blue-light px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-light/30 transition-all hover:bg-blue-light/90 disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            Entrar no CRM
          </button>
        </form>
      </div>
    </div>
  );
}
