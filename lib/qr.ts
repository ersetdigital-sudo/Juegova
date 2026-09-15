const SIZE = 25;

export const QR_SIZE = SIZE;

/**
 * Pola QR dekoratif deterministik dari invoice — hasilnya sama persis dengan
 * algoritma di HTML asli. CATATAN: ini bukan QR asli yang bisa di-scan,
 * perlu diganti dengan QR dari payment gateway sungguhan.
 */
export function buildQrCells(seed: string): { x: number; y: number }[] {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  const random = () => {
    hash = (hash * 1103515245 + 12345) >>> 0;
    return hash / 4294967296;
  };

  const isFinderPattern = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > SIZE - 8 && y < 7) || (x < 7 && y > SIZE - 8);

  const cells: { x: number; y: number }[] = [];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let on: boolean;
      if (isFinderPattern(x, y)) {
        const fx = x < 7 ? x : SIZE - 1 - x;
        const fy = y < 7 ? y : SIZE - 1 - y;
        on =
          fx === 0 ||
          fx === 6 ||
          fy === 0 ||
          fy === 6 ||
          (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
      } else {
        on = random() > 0.5;
      }
      if (on) cells.push({ x, y });
    }
  }

  return cells;
}
