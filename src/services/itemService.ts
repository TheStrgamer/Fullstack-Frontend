export function itemServices() {
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
    console.log(await response.json());
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
    console.log(await response.json());
    return response.json();
  }

  return {
    fetchItemFromAPI,
    fetchConditionsFromAPI,
    fetchCategoriesFromAPI,
  }
}