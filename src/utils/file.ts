export async function uploadFile(file: File): Promise<string> {
  // In a real application, this would upload to a storage service
  // For this demo, we'll create an object URL
  return URL.createObjectURL(file);
}