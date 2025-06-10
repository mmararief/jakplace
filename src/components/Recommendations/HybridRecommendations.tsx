import React, { useEffect, useState } from "react";
import { getRecommendationsByUser } from "../../api/recommendations";
import { Place } from "../../types";

const HybridRecommendations: React.FC<{ userId: number }> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(userId);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendationsByUser(userId);
        setRecommendations(data);
      } catch (err) {
        setError("Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Hybrid Recommendations</h2>
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

export default HybridRecommendations;
