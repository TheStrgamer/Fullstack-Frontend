import { useUserStore } from '@/stores/UserStore.ts'

export function itemServices() {
  const userStore = useUserStore();

  async function fetchItemFromAPI(itemId: string) {
    const response = await fetch(`http://localhost:8080/api/listings/id/${itemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching item");
    }
    return response.json();
  }

  async function fetchConditionsFromAPI() {
    const response = await fetch("http://localhost:8080/api/listings/conditions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching conditions");
    }
    return response.json();
  }

  async function fetchCategoriesFromAPI() {
    const response = await fetch("http://localhost:8080/api/listings/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching categories");
    }
    return response.json();
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

      const response = await fetch("http://localhost:8080/api/listings/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${userStore.jwtToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedItem),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Error creating item: ${response.status} - ${errorText}`);
      }
      return response.json();
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