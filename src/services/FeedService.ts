// Fetch recommended items from the API
export const fetchRecommendedItems = async (count: number) => {
  const response = await fetch(`http://localhost:8080/api/listings/all`,);
  console.log(response);
  return response.json();
};