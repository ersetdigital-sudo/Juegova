import { Fragment } from "react";
import { cx } from "@/lib/cx";

const CHECKOUT_STEPS = ["Pilih Nominal", "Pembayaran", "Selesai"];

/** Halaman pembayaran selalu berada di langkah 2. */
const CURRENT_INDEX = 1;

export function CheckoutStepper() {
  return (
    <div className="mt-7 flex items-center gap-2 text-[11px] font-bold">
      {CHECKOUT_STEPS.map((label, index) => {
        const isActive = index === CURRENT_INDEX;
        return (
          <Fragment key={label}>
            {index > 0 ? (
              <span
                className={cx(
                  "flex-1 h-0.5 rounded",
                  index <= CURRENT_INDEX ? "bg-blue-600" : "bg-slate-200",
                )}
              />
            ) : null}
            <span
              className={cx("flex items-center gap-2", isActive ? "text-blue-700" : "text-slate-400")}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cx(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  isActive ? "grad text-white" : "bg-slate-200 text-slate-500",
                )}
              >
                {index + 1}
              </span>
              {label}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
