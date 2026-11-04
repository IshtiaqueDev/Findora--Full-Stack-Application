const configuredApiUrl = import.meta.env.VITE_API_URL || "https://findora-full-stack-application-production.up.railway.app";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export const getImageUrl = (imageUrl) =>
    imageUrl?.startsWith("/") ? `${API_URL}${imageUrl}` : imageUrl;
