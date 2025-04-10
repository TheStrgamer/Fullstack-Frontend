import axios from "axios";
import { useUserStore } from "../stores/UserStore";

const backendUrl = "http://localhost:8080/";
const apiUrl = `${backendUrl}api/`;

export async function fetchDataWithAuth(endpoint: string, json: boolean = false) {
  try {
    let token = sessionStorage.getItem("jwtToken") || "";
    if (!token) {
      throw new Error("No token found");
    }
    console.log("Sedning get request to:", apiUrl + endpoint);
    if (json) {
        return await axios.get(apiUrl + endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    }
    return await axios.get(apiUrl + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    logoutIfTokenInvalid();
    throw error;
  }
}

export async function fetchDataWithoutAuth(endpoint: string, json: boolean = false) {
  try {
    console.log("Sedning get request to:", apiUrl + endpoint);

    if (json) {
        return await axios.get(apiUrl + endpoint, {
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
    return await axios.get(apiUrl + endpoint);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
export async function postDataWithAuth(endpoint: string, data: any) {
  try {
    let token = sessionStorage.getItem("jwtToken") || "";
    if (!token) {
      throw new Error("No token found");
    }
    console.log("Sedning post request to:", apiUrl + endpoint);
    const response = await axios.post(apiUrl + endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    logoutIfTokenInvalid()
    throw error;
  }
}

export async function postDataWithoutAuth(endpoint: string, data: any) {
  try {
    console.log("Sedning post request to:", apiUrl + endpoint);
    const response = await axios.post(apiUrl + endpoint, data);
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function deleteDataWithAuth(endpoint: string) {
  try {
    let token = sessionStorage.getItem("jwtToken") || "";
    if (!token) {
      throw new Error("No token found");
    }
    console.log("Sedning delete request to:", apiUrl + endpoint);
    const response = await axios.delete(apiUrl + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    logoutIfTokenInvalid();
    if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
    }
    throw error
  }
}

export async function putDataWithAuth(endpoint: string, data: any) {
    try {
      let token = sessionStorage.getItem("jwtToken") || "";
      if (!token) {
        throw new Error("No token found");
      }
      console.log("Sending PUT request to:", apiUrl + endpoint);
      const response = await axios.put(apiUrl + endpoint, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error putting data:", error);
      logoutIfTokenInvalid();
      throw error;
    }
  }

export function getUrlFromEndpoint(endpoint: string) {
  return backendUrl + endpoint;
}

async function validateUserToken() {
  try{
    let token = sessionStorage.getItem("jwtToken") || "";
    if (!token) {
        console.error("No token found");
        return false;
    }
    const response = await fetchDataWithAuth("users/validate");
    if (response.status !== 200) {
            console.error("Invalid token");
            return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
}

async function logoutIfTokenInvalid() {
    const isValid = await validateUserToken();
    if (!isValid) {
        console.error("Token is not valid, logging out");
        let userStore = useUserStore();
        userStore.logout();
    }
}

export async function isUserAdmin() {
  try {
    const response = await fetchDataWithAuth("admin/amIAdmin");
    sessionStorage.setItem("isAdmin", response.data);
    return response.data;
  } catch (error) {
    sessionStorage.setItem("isAdmin", "false");
    return false;
  }
}

// Hent alle kategorinavn (uten auth)
export async function getAllCategoryNames(): Promise<string[]> {
  try {
    const response = await fetchDataWithoutAuth("categories");
    return response.data;
  } catch (error) {
    console.error("Kunne ikke hente kategorier:", error);
    return [];
  }
}

// Hent alle listings i gitt kategori (med eller uten auth)
export async function getListingsByCategory(categoryName: string): Promise<any[]> {
  try {
    const userStore = useUserStore()
    const endpoint = `categories/category/${encodeURIComponent(categoryName)}`

    const response = userStore.isAuthenticated()
      ? await fetchDataWithAuth(endpoint)
      : await fetchDataWithoutAuth(endpoint)

    return response.data
  } catch (error) {
    console.error(`Feil ved henting av annonser for kategori ${categoryName}:`, error)
    return []
  }
}