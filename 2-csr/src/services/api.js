/**
 * Couche "client API" : le backend est utilisé comme un serveur de données (API REST).
 * Dans une architecture CSR (Single Page Application), le navigateur récupère du JSON
 * puis réalise le rendu côté client.
 *
 * Routes principales utilisées dans le TD :
 * - GET /recipes
 * - GET /recipes/:id
 * - POST /login
 * - GET/POST/DELETE /users/:username/favorites
 */

const API_URL = 'https://gourmet.cours.quimerch.com';

/**
 * Normalise les réponses HTTP de l’API REST.
 * Objectif : centraliser la gestion d’erreurs et la lecture JSON pour éviter de dupliquer
 * la logique dans les composants React.
 */


async function handleResponse(response) {
  // Pour les favoris, accepter aussi les réponses vides ou non-JSON
  const contentType = response.headers.get('content-type');
  
  // Si la réponse est OK mais pas du JSON, on considère ça comme un succès
  if (response.ok && (!contentType || !contentType.includes('application/json'))) {
    return { success: true, status: response.status };
  }

  async function handleResponse(response) {
  const contentType = response.headers.get('content-type');

  // Si OK et pas JSON => succès
  if (response.ok && (!contentType || !contentType.includes('application/json'))) {
    return { success: true, status: response.status };
  }

  // Si pas JSON => lire le texte, et en faire une vraie erreur si !ok
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `Erreur HTTP: ${response.status}`);
    }
    return { success: true, status: response.status, raw: text };
  }

  // JSON
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Erreur HTTP: ${response.status}`);
  }
  return data;
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
    const response = await fetch(`${API_URL}/login`, {
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

export async function getFavoritesByUser(username, token) {
  const response = await fetch(
    `${API_URL}/users/${encodeURIComponent(username)}/favorites`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
    }
  );

  return handleResponse(response);
}

export async function addToFavorites(username, recipeID, token) {
  const url = `${API_URL}/users/${encodeURIComponent(username)}/favorites?recipeID=${encodeURIComponent(recipeID)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'Accept': 'application/json, application/xml',
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

export async function removeFromFavorites(username, recipeID, token) {
  const url = `${API_URL}/users/${encodeURIComponent(username)}/favorites?recipeID=${encodeURIComponent(recipeID)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'Accept': 'application/json, application/xml',
    },
  });

  return handleResponse(response);
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

