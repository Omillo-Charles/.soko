"use client";

import React from "react";
import Carousel from "./Carousel";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt }) => {
  // Clean up images array: filter null/undefined and ensure valid URLs
  const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== "");
  
  // If no valid images, don't render anything
  if (validImages.length === 0) return null;

  return (
    <div className="relative w-full h-full group/carousel">
      <Carousel
        items={validImages}
        aspectRatio="h-full"
        variant="slide"
        showArrows={true}
        showDots={true}
        renderItem={(src, index) => (
          <div className="w-full h-full relative">
            <img 
              src={src} 
              alt={`${alt} - Background ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-110 pointer-events-none" 
            />
            <img 
              src={src} 
              alt={`${alt} - Image ${index + 1}`} 
              className="relative w-full h-full object-contain z-10 p-2" 
            />
          </div>
        )}
      />
    </div>
  );
};
