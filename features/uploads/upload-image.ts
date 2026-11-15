export async function uploadImage(traceId: string, file: File): Promise<string> {
  const body = new FormData();
  body.append("filex", file, file.name);
  const response = await fetch(`/api/uploads/traces/${encodeURIComponent(traceId)}/files`, { method: "POST", body });
  const payload = await response.json();
  if (!response.ok || payload.success !== true) throw new Error(payload.message || "Şəkil yüklənmədi.");
  const name = payload.data?.file_name;
  if (typeof name !== "string" || !/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png)$/i.test(name)) throw new Error("Şəklin fayl adı alınmadı.");
  return name;
}
