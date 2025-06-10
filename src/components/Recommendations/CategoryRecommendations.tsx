import React, { useEffect, useState } from "react";
import { getRecommendationsByCategory } from "../../api/recommendations";
import { Place } from "../../types";

const CategoryRecommendations: React.FC<{ category: string }> = ({
  category,
}) => {
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendationsByCategory([category]);
        setRecommendations(data);
      } catch (err) {
        setError("Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category]);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Recommendations for {category}</h2>
      <ul>
        {recommendations.map((place) => (
          <li key={place.id}>
            <h3>{place.name}</h3>
            <p>{place.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryRecommendations;
