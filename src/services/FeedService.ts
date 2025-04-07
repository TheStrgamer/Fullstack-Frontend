// Fetch recommended items from the API
export const fetchRecommendedItems = async (count: number, token:string) => {
  const response = await fetch(`http://localhost:8080/api/listings/recommended?count=${count}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${token}',
    },
  });
  if (!response.ok) throw new Error("Failed to fetch recommended items");
  console.log(response);
  return response.json();
};

export const fetchRandomItems = async (count: number) => {
  const response = await fetch(`http://localhost:8080/api/listings/random?count=${count}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error("Failed to fetch random items");
  console.log(response);
  return response.json();
};