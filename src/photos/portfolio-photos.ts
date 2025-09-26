// Central place to manage photos used across the site.
// Replace the URLs below with your own to update images everywhere.

export type PortfolioPhoto = {
  id: string;
  title: string;
  url: string;
  width?: number;
  height?: number;
};

export const portfolioPhotos: PortfolioPhoto[] = [
  {
    id: "portrait1",
    title: "IMG1041.heic",
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/IMG_1041.jpg",
    width: 800,
    height: 800,
  },
  {
    id: "portrait2",
    title: "IMG0641.heic",
    url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/IMG_0641.jpg",
    width: 1200,
    height: 800,
  },
];

export const getPhotoById = (id: string) => portfolioPhotos.find((p) => p.id === id);