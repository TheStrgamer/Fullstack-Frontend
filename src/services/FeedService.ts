import { fetchDataWithoutAuth, fetchDataWithAuth } from "./httpService";
// Fetch recommended items from the API
export const fetchRecommendedItems = async (count: number, token:string) => {
  const response = await fetchDataWithAuth(`listings/recommended?count=${count}`, true);
  return response.data;
};

export const fetchRandomItems = async (count: number) => {
  const response = await fetchDataWithoutAuth(`listings/random?count=${count}`, true);
  return response.data;
};