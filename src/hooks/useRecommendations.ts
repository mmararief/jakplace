import { useEffect, useState } from 'react';
import { getRecommendationsByPlace, getRecommendationsByUser, getNearbyPlaces, getRecommendationsByCategory } from '../api/recommendations';
import { Place } from '../types';

const useRecommendations = (
  userId?: number,
  placeId?: number,
  category?: string,
  lat?: number,
  lon?: number
) => {
    const [recommendations, setRecommendations] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                let data: Place[] = [];
                if (placeId) {
                    data = await getRecommendationsByPlace(placeId);
                } else if (userId) {
                    data = await getRecommendationsByUser(userId);
                } else if (lat !== undefined && lon !== undefined) {
                    data = await getNearbyPlaces(lat, lon);
                } else if (category) {
                    data = await getRecommendationsByCategory([category]);
                }
                setRecommendations(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId, placeId, category, lat, lon]);

    return { recommendations, loading };
};

export default useRecommendations;