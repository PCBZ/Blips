export async function fetchGet(endpoint) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("*********");
      console.error(data);
      throw new Error(data.error);
    }
  } catch (error) {
    throw error;
  }
};