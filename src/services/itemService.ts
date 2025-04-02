export async function fetchItemFromAPI(itemId: string) {
  const response = await fetch(`api-url/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (!response.ok) {
    throw new Error("Error fetching item");
  }
  return response.json();
}