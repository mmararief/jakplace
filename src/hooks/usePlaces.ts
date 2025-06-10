import { useEffect, useState } from 'react';
import { getPlaces } from '../api/places';
import { Place } from '../types';

const usePlaces = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await getPlaces();
                setPlaces(data);
            } catch (err) {
                setError('Failed to fetch places');
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    return { places, loading, error };
};

export default usePlaces;