const API_URL = 'https://gourmet.cours.quimerch.com';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Réponse non-JSON reçue:', text);
    throw new Error('Le serveur a renvoyé une réponse invalide');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
  }
  
  return response.json();
}

export async function getRecettes() {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erreur getRecettes:', error);
    throw error;
  }
}

export async function getRecette(id) {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erreur getRecette:', error);
    throw error;
  }
}

export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
}

export async function addToFavorites(recetteId, token) {
  try {
    const response = await fetch(`${API_URL}/favorites/${recetteId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erreur addToFavorites:', error);
    throw error;
  }
}

export async function removeFromFavorites(recetteId, token) {
  try {
    const response = await fetch(`${API_URL}/favorites/${recetteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erreur removeFromFavorites:', error);
    throw error;
  }
}

export async function getFavorites(token) {
  try {
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erreur getFavorites:', error);
    throw error;
  }
}