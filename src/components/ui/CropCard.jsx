import React from 'react';
import { MapPin, Calendar, Heart, Star, Package } from 'lucide-react';
import { Badge, Card, Button } from '../ui';
import { getStatusColor } from '../../utils/designSystem';

const CropCard = ({ crop, onFavorite, onViewDetails, className = '' }) => {
  const {
    id,
    name,
    farmer,
    location,
    price,
    unit,
    quantity,
    status,
    image,
    rating = 0,
    reviews = 0,
    harvestDate,
    description,
    category,
    isFavorited = false
  } = crop;

  return (
    <Card 
      hover 
      padding="none" 
      className={`overflow-hidden h-full ${className}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-agrovia-50">
            <Package className="w-16 h-16 text-agrovia-300" />
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => onFavorite?.(id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorited 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge status={status} className="shadow-sm">
            {status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
              {name}
            </h3>
            {category && (
              <Badge variant="neutral" className="text-xs">
                {category}
              </Badge>
            )}
          </div>
          
          {/* Farmer Info */}
          <p className="text-sm text-neutral-600 mb-1">
            By {farmer?.name || 'Unknown Farmer'}
          </p>
          
          {/* Location */}
          <div className="flex items-center text-sm text-neutral-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-neutral-600">
              {rating.toFixed(1)} ({reviews} reviews)
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Quantity:</span>
            <span className="font-medium text-neutral-700">{quantity} {unit}</span>
          </div>
          
          {harvestDate && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Harvest Date:</span>
              <div className="flex items-center text-neutral-700">
                <Calendar className="w-3 h-3 mr-1" />
                <span className="font-medium">{harvestDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-agrovia-600">
              Rs. {price.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500">per {unit}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails?.(id)}
            >
              View Details
            </Button>
            
            {status === 'available' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => {/* Handle add to cart */}}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CropCard;
