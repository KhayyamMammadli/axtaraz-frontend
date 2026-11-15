export const mobileNumberPattern = /^\(0\d{2}\) \d{3}-\d{2}-\d{2}$/;

export function formatMobileNumber(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("994") && digits.length >= 12) digits = `0${digits.slice(3)}`;
  else if (digits && !digits.startsWith("0")) digits = `0${digits}`;
  digits = digits.slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  let result = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}
