import { useUserStore } from '@/stores/UserStore.ts'
import { fetchDataWithoutAuth, postDataWithAuth } from './httpService';

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
        category: typeof item.category === 'object' ? item.category : { id: item.category },
        condition: typeof item.condition === 'object' ? item.condition : { id: item.condition },
        title: item.title,
        sale_status: typeof item.sale_status === 'string' ? parseInt(item.sale_status) : item.sale_status || 0,
        price: item.price,
        brief_description: item.brief_description,
        full_description: item.full_description,
        size: item.size || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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

  return {
    fetchItemFromAPI,
    fetchConditionsFromAPI,
    fetchCategoriesFromAPI,
    createItem,
  }
}