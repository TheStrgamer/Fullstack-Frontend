import { useUserStore } from '@/stores/UserStore.ts'
import { fetchDataWithoutAuth, postDataWithAuth, putDataWithAuth, deleteDataWithAuth } from './httpService';

export function itemServices() {
  const userStore = useUserStore();

  async function fetchItemFromAPI(itemId: string) {
    const response = await fetchDataWithoutAuth(`listings/id/${itemId}`);

    return response.data
  }

  async function fetchConditionsFromAPI() {
    const response = await fetchDataWithoutAuth("listings/conditions");
    return response.data;
  }

  async function fetchCategoriesFromAPI() {
    const response = await fetchDataWithoutAuth("listings/categories");
    return response.data;
  }

  async function createItem(item: any) {
    try {
      await userStore.refreshTokenIfNeeded();

      const formattedItem = {
        category: item.category,
        condition: item.condition,
        title: item.title,
        saleStatus: typeof item.sale_status === 'string' ? parseInt(item.sale_status) : item.sale_status || 0,
        price: item.price,
        briefDescription: item.brief_description,
        fullDescription: item.full_description,
        size: item.size || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latitude: item.latitude || 0,
        longitude: item.longitude || 0
      };

      console.log("Sending formatted item to server:", formattedItem);
      const response = await postDataWithAuth("listings/create", formattedItem);

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
        longitude: item.longitude || 0,
        images: item.imageUrls
      };

      console.log("Sending formatted item to server:", formattedItem);
      const response = await putDataWithAuth(`listings/update/${item.id}`, formattedItem);

      return response.data;
  
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }

  async function deleteItem(itemId: string) {
    try {
      const response = await deleteDataWithAuth(`listings/${itemId}/delete`);
      return response;
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  }
  

  return {
    fetchItemFromAPI,
    fetchConditionsFromAPI,
    fetchCategoriesFromAPI,
    createItem,
    updateItem,
    deleteItem
  }
}