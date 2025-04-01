// Fetch recommended items from the API
export const fetchRecommendedItems = async (count: number) => {
  const response = await fetch(`api-url/recommended-items/${count}`);
  return response.json();
};