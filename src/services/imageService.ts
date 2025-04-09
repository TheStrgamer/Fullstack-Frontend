import { useUserStore } from '@/stores/UserStore.ts'
import { fetchDataWithoutAuth, postDataWithAuth, putDataWithAuth, postImages} from './httpService';

export function imageService() {
  const userStore = useUserStore();

  async function fetchImageFromAPI(itemId: string) {
    const response = await fetchDataWithoutAuth(`images/get${itemId}`);

    return response.data
  }


  async function uploadImages(imageData: any) {
    try {
      await userStore.refreshTokenIfNeeded();

      const formattedItem = {
      };

      console.log("Sending formatted item to server:", formattedItem);
      const response = await postImages("images/uploadListing", formattedItem);

      return response.data;
  
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  }

  async function updateItem(item: any) {
    try {
      await userStore.refreshTokenIfNeeded();

      const formattedItem = {
        title: item.title,
        category_id: item.category,
        condition_id: item.condition,
        price: item.price,
        sale_status: typeof item.sale_status === 'string' ? parseInt(item.sale_status) : item.sale_status || 0,
        brief_description: item.brief_description,
        full_description: item.full_description,
        size: item.size || "",
        updatedAt: new Date().toISOString(),
        latitude: item.latitude || 0,
        longitude: item.longitude || 0
      };

      console.log("Sending formatted item to server:", formattedItem);
      const response = await putDataWithAuth(`listings/update/${item.id}`, formattedItem);

      return response.data;
  
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }

  return {
    fetchItemFromAPI,
    fetchConditionsFromAPI,
    fetchCategoriesFromAPI,
    createItem,
    updateItem,
    uploadImages,
  }
}