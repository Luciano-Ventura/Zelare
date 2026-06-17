export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

/**
 * Busca coordenadas de um endereço usando a API gratuita do OpenStreetMap (Nominatim).
 * Importante: A API exige um User-Agent válido e permite no máximo 1 requisição por segundo.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=br`;

    const response = await fetch(url, {
      headers: {
        // Nominatim requires a valid User-Agent
        'User-Agent': 'ZelareApp/1.0',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });

    if (!response.ok) {
      console.error(`Erro na geocodificação: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
}

/**
 * Calcula a distância em quilômetros entre duas coordenadas (Fórmula de Haversine).
 */
export function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
