// Inspiration by https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/digest

export const genHashSHA256 = async (value: string) => {
  const encoder = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  const array = Array.from(new Uint8Array(buf));
  return array.map((b) => b.toString(16).padStart(2, "0")).join("");
};
