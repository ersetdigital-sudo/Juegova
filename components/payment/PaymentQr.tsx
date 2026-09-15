import { buildQrCells, QR_SIZE } from "@/lib/qr";

interface PaymentQrProps {
  /** Dipakai sebagai benih pola — sama seperti invoice+total di HTML asli. */
  seed: string;
}

/** Pola QR dekoratif (bukan QR asli yang bisa di-scan). */
export function PaymentQr({ seed }: PaymentQrProps) {
  const cells = buildQrCells(seed);

  return (
    <div className="w-[200px] h-[200px]">
      <svg
        viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
        role="img"
        aria-label="Contoh kode QR pembayaran"
      >
        <rect width={QR_SIZE} height={QR_SIZE} fill="#fff" />
        <g fill="#12131a">
          {cells.map((cell) => (
            <rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width="1" height="1" />
          ))}
        </g>
      </svg>
    </div>
  );
}
