// Generate QR code image URL from book copy ID
export function generateBarcodeUrl(bookCopyId: string): string {
  const barcodeData = `COPY-${bookCopyId}`;
  // Using QR Server API for QR code generation with larger size
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(barcodeData)}`;
}

// Parse QR/barcode data to extract book copy ID
export function parseBarcode(barcodeData: string): string | null {
  if (barcodeData.startsWith('COPY-')) {
    return barcodeData.substring(5); // Remove 'COPY-' prefix
  }
  return null;
}
