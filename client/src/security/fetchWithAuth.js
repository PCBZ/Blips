// This function is used to fetch data from the server with the credentials option set to include.

export async function fetchWithAuth(endpoint, options = {}) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, { ...options, credentials: "include" });
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
  
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
  
    return res;
  } catch (error) {
    console.error("Error during fetchWithAuth:", error);
    throw error;
  }
}
  
export async function fetchGetWithAuth(endpoint) {
  try {
    const res = await fetchWithAuth(endpoint);
    return res.json();
  } catch (error) {
    console.error("Error during fetchGetWithAuth:", error);
    throw error;
  }
}
  
export async function fetchPostWithAuth(endpoint, data) {
  return fetchWithAuth(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function fetchPutWithAuth(endpoint, data) {
  try {
    const res = await fetchWithAuth(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    console.error("Error during fetchPutWithAuth:", error);
    throw error;
  }
}
export async function fetchDeleteWithAuth(url) {
  return fetchWithAuth(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}