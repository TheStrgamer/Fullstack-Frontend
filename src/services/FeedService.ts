import { useUserStore } from '../stores/UserStore';

// Fetch recommended items from the API
export const fetchRecommendedItems = async (count: number) => {
  const userStore = useUserStore();
  let token = userStore.jwtToken;
  if (!token) {
    console.error('No JWT token found in store');
    return null;
  }
  if (userStore.isTokenExpired()) {
    console.warn('JWT token is expired');
    return null;
  }
  const response = await fetch(`http://localhost:8080/api/listings/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
  return response.json();
};