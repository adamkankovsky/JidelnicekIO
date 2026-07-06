export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/csv;charset=utf-8',
): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const blob = new Blob(['\ufeff', content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
