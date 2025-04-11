import { postDataWithAuth, fetchDataWithAuth } from './httpService';

export async function toggleFavorite(listingId: number) {
  console.log("Toggler favoritt for listing:", listingId);
  const response = await postDataWithAuth(`users/favorites/toggle/${listingId}`, {});
  console.log("Respons fra server:", response);
  return response?.data?.isFavorited ?? false;
}

export async function checkFavoriteStatus(listingId: number): Promise<boolean> {
    try {
      const response = await fetchDataWithAuth(`users/favorites/check/${listingId}`);
      return response.data === true;
    } catch (error) {
      console.error("Feil ved sjekk av favorittstatus:", error);
      return false;
    }
  }

export async function checkIfUserOwnsListing(listingId: number): Promise<boolean> {
    try {
      const response = await fetchDataWithAuth(`users/owns/${listingId}`);
      return response.data === true;
    } catch (error) {
      console.error("Feil ved sjekk av eierskap:", error);
      return false;
    }
}