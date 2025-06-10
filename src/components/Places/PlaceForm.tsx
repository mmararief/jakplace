import React, { useState } from "react";
import { createPlace, updatePlace } from "../../api/places";
import { Place } from "../../types";

interface PlaceFormProps {
  initialPlace?: Place;
  onSubmit: () => void;
}

const PlaceForm: React.FC<PlaceFormProps> = ({ initialPlace, onSubmit }) => {
  const [name, setName] = useState(initialPlace?.name || "");
  const [description, setDescription] = useState(
    initialPlace?.description || ""
  );
  const [category, setCategory] = useState(initialPlace?.category || "");
  const [latitude, setLatitude] = useState(initialPlace?.latitude || 0);
  const [longitude, setLongitude] = useState(initialPlace?.longitude || 0);
  const [price, setPrice] = useState(initialPlace?.price || 0);
  const [imageUrl, setImageUrl] = useState(initialPlace?.image_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialPlace) {
      await updatePlace(initialPlace.id, {
        ...initialPlace,
        name,
        description,
        category,
        latitude,
        longitude,
        price,
        image_url: imageUrl,
      });
    } else {
      await createPlace({
        name,
        description,
        category,
        latitude,
        longitude,
        price,
        image_url: imageUrl,
      });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <input
        type="number"
        value={latitude}
        onChange={(e) => setLatitude(Number(e.target.value))}
        placeholder="Latitude"
        required
      />
      <input
        type="number"
        value={longitude}
        onChange={(e) => setLongitude(Number(e.target.value))}
        placeholder="Longitude"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
        required
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        required
      />
      <button type="submit">
        {initialPlace ? "Update Place" : "Add Place"}
      </button>
    </form>
  );
};

export default PlaceForm;
