import axios from '../utils/axios';
import { Place } from '../types';
import { recommendationCache } from '../utils/cache';


export const getRecommendationsByPlace = async (placeId: number): Promise<Place[]> => {
    const cacheKey = `recommendations_place_${placeId}`;
    
    // Check cache first
    const cachedResult = recommendationCache.get<Place[]>(cacheKey);
    if (cachedResult) {
        console.log('🎯 Recommendations loaded from cache');
        return cachedResult;
    }
    
    // Fetch from server
    const response = await axios.get(`/recommend/by_place?place_id=${placeId}&top_n=6`);
    const data = response.data;
    
    // Cache result for 10 minutes
    recommendationCache.set(cacheKey, data, 10 * 60 * 1000);
    console.log('🔄 Recommendations cached');
    
    return data;
};

export const getRecommendationsByUser = async (userId: number): Promise<Place[]> => {
    const cacheKey = `recommendations_user_${userId}`;
    
    // Check cache first
    const cachedResult = recommendationCache.get<Place[]>(cacheKey);
    if (cachedResult) {
        console.log('🎯 Hybrid recommendations loaded from cache');
        return cachedResult;
    }
    
    // Fetch from server
    const response = await axios.get(`/recommend/by_hybrid?user_id=${userId}&top_n=6`);
    const data = response.data;
    
    // Cache result for 5 minutes (user preferences can change more frequently)
    recommendationCache.set(cacheKey, data, 5 * 60 * 1000);
    console.log('🔄 Hybrid recommendations cached');
    
    return data;
};

export const getNearbyPlaces = async (lat: number, lon: number): Promise<Place[]> => {
    // Round coordinates to reduce cache variations (precision to ~100m)
    const roundedLat = Math.round(lat * 1000) / 1000;
    const roundedLon = Math.round(lon * 1000) / 1000;
    const cacheKey = `nearby_${roundedLat}_${roundedLon}`;
    
    // Check cache first
    const cachedResult = recommendationCache.get<Place[]>(cacheKey);
    if (cachedResult) {
        console.log('🎯 Nearby places loaded from cache');
        return cachedResult;
    }
    
    // Fetch from server
    const response = await axios.get(`/recommend/nearby?lat=${lat}&lon=${lon}`);
    const data = response.data;
    
    // Cache result for 15 minutes (nearby places change less frequently)
    recommendationCache.set(cacheKey, data, 15 * 60 * 1000);
    console.log('🔄 Nearby places cached');
    
    return data;
};

export const getRecommendationsByCategory = async (categories: string[]): Promise<Place[]> => {
    // Sort categories for consistent cache keys
    const sortedCategories = [...categories].sort();
    const cacheKey = `recommendations_category_${sortedCategories.join('_')}`;
    
    // Check cache first
    const cachedResult = recommendationCache.get<Place[]>(cacheKey);
    if (cachedResult) {
        console.log('🎯 Category recommendations loaded from cache');
        return cachedResult;
    }
    
    // Fetch from server
    const response = await axios.get(`/recommend/by_category?categories=${categories.join(',')}&top_n=6`);
    const data = response.data;
    
    // Cache result for 20 minutes (category data is more stable)
    recommendationCache.set(cacheKey, data, 20 * 60 * 1000);
    console.log('🔄 Category recommendations cached');
    
    return data;
};