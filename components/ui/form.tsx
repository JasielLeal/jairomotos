"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {error[0]}
        </p>
      )}
    </div>
  );
}

export function FormMessage({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "success";
}) {
  const toneClass =
    tone === "error"
      ? "bg-destructive/10 text-destructive"
      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <p className={cn("flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium", toneClass)}>
      <Icon className="size-4 shrink-0" />
      {message}
    </p>
  );
}

function centsToBRLInput(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CurrencyInput({
  id,
  name,
  defaultValueCents = 0,
  onValueChange,
  required,
  disabled,
  className,
}: {
  id: string;
  name: string;
  defaultValueCents?: number;
  onValueChange?: (cents: number) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [cents, setCents] = useState(defaultValueCents);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const next = digits ? Number.parseInt(digits, 10) : 0;
    setCents(next);
    onValueChange?.(next);
  }

  return (
    <>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={centsToBRLInput(cents)}
        onChange={handleChange}
        disabled={disabled}
        aria-required={required}
        className={cn("text-right tabular-nums", className)}
      />
      <input type="hidden" name={name} value={cents} />
    </>
  );
}
