export async function fetchGet(endpoint) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data;
  };