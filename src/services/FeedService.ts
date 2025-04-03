// Fetch recommended items from the API
export const fetchRecommendedItems = async (count: number) => {
  const response = await fetch(`http://localhost:8080/api/listings/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(response);
  return response.json();
};