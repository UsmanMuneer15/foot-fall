"use client";

import {
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { BookingModal } from "@/components/BookingModal";
import { requireAuthForBooking } from "@/lib/bookingGate";

type CreateActivationButtonProps = {
  className?: string;
  children?: ReactNode;
  /** Optional product to pre-select in BookingModal */
  productId?: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type" | "children"
>;

/**
 * Site-wide CTA for create-an-activation.
 * Logged in → opens BookingModal; otherwise silent redirect to /login.
 */
export function CreateActivationButton({
  className,
  children = "Create an Activation",
  productId,
  ...rest
}: CreateActivationButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  function handleClick() {
    if (!requireAuthForBooking(router)) return;
    setSelectedProductId(productId ?? null);
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        initialProductId={selectedProductId}
      />
    </>
  );
}
