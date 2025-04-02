export async function fetchItemFromAPI(itemId: string) {
  const response = await fetch(`http://localhost:8080/api/listings/id/${itemId}`, {
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