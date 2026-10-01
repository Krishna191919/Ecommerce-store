export const extractError = async (res) => {
  try {
    const data = await res.json();
    if (data?.message) return data.message;
    if (data?.errors) {
      return Object.values(data.errors).flat().join(" ");
    }
    if (typeof data === "string") return data;
    return `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
};
