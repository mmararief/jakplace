import axios from '../utils/axios';
import { Place, PlaceInput, Rating, RatingRequest } from '../types';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

// List Semua Tempat
export const getPlaces = async (): Promise<Place[]> => {
    const response = await axios.get('/places');
    return response.data;
};

// Detail Tempat Wisata (Butuh JWT Auth)
export const getPlaceById = async (id: number): Promise<Place> => {
    const response = await axios.get(`/places/${id}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Tambah Tempat Wisata
export const createPlace = async (place: PlaceInput): Promise<Place> => {
    const response = await axios.post('/places', place);
    return response.data;
};

// Update Tempat Wisata
export const updatePlace = async (id: number, place: PlaceInput): Promise<Place> => {
    const response = await axios.put(`/places/${id}`, place);
    return response.data;
};

// Hapus Tempat Wisata
export const deletePlace = async (id: number): Promise<void> => {
    await axios.delete(`/places/${id}`);
};

// Beri Rating Tempat Wisata (Butuh JWT Auth)
export const ratePlaceById = async (id: number, ratingData: RatingRequest): Promise<Rating> => {
    const response = await axios.post(`/places/${id}/rate`, ratingData, {
        headers: getAuthHeaders()
    });
    return response.data;
};