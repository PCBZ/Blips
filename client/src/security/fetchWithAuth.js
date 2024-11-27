// This function is used to fetch data from the server with the credentials option set to include.

export async function fetchWithAuth(endpoint, options = {}) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, { ...options, credentials: "include" });
  if (res.status === 401) {
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res;
}

export async function fetchGetWithAuth(endpoint) {
  const res = await fetchWithAuth(endpoint);
  return res.json();
}
  
export async function fetchPostWithAuth(endpoint, data, isFormData = false) {
  const options = { method: "POST" }
  if (!isFormData) {
    options.headers = {
      "Content-Type": "application/json",
    }
    options.body = JSON.stringify(data);
  } else {
    options.body = data;
  }

  const res = await fetchWithAuth(endpoint, options);
  return res.json();
}

export async function fetchPutWithAuth(endpoint, data, isFormData = false) {
  const options = { method: "PUT" };
  if (!isFormData) {
    options.headers = {
      "Content-Type": "application/json",
    }
    options.body = JSON.stringify(data);
  } else {
    options.body = data;
  }
  const res = await fetchWithAuth(endpoint, options);
  return res.json();
}
export async function fetchDeleteWithAuth(endpoint, data) {
  return fetchWithAuth(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}