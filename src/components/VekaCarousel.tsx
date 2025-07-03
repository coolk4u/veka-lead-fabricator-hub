
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const VekaCarousel = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
      title: "Veka uPVC Windows",
      description: "Premium quality windows for modern homes"
    },
    {
      src: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=400&fit=crop",
      title: "Veka Sliding Doors",
      description: "Elegant and secure door solutions"
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=400&fit=crop",
      title: "Veka Conservatories",
      description: "Beautiful conservatory designs"
    }
  ];

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Veka Products</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-2xl">
                    <h4 className="text-white font-semibold">{image.title}</h4>
                    <p className="text-white/90 text-sm">{image.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default VekaCarousel;
