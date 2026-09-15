import { SearchIcon } from "@/components/ui/Icon";

interface TransactionLookupProps {
  defaultValue?: string;
}

/**
 * Form GET biasa, jadi pencarian tetap jalan walau JavaScript gagal dimuat
 * dan hasilnya bisa dibagikan lewat URL.
 */
export function TransactionLookup({ defaultValue = "" }: TransactionLookupProps) {
  return (
    <form action="/cek-transaksi" method="get" className="mt-7">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Order ID</span>
          <input
            name="invoice"
            defaultValue={defaultValue}
            required
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Contoh: JGV-260915-4821"
            className="mono w-full rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold tracking-wide shadow-sm uppercase transition-colors outline-none placeholder:font-normal placeholder:tracking-normal placeholder:normal-case focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-600/25 transition-transform grad hover:brightness-110 active:scale-[.98]"
        >
          <SearchIcon className="h-4 w-4" />
          Cek Transaksi
        </button>
      </div>
    </form>
  );
}
