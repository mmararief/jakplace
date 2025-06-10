export interface User {
  id: number;
  name: string;
  email: string;
  preferences: string[];
  age: number; // Menambahkan properti age
}

export interface Place {
  id: number;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  price: number;
  image_url: string;
  avgRating: number;
  userRating?: number | null; // Rating dari user yang sedang login (null jika belum pernah rating)
  ratings?: Rating[]; // Tambahkan ratings opsional untuk detail
}

export interface PlaceInput {
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  price: number;
  image_url: string;
}

export interface Rating {
  id: number;
  value: number;
  userId: number;
  placeId: number;
}

export interface RatingRequest {
  value: number;
}

