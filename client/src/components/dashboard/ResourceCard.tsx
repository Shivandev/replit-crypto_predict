interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  duration: string;
  rating: number;
  ratingCount: number;
  iconType: string;
}

export default function ResourceCard({
  title,
  description,
  type,
  duration,
  rating,
  ratingCount,
  iconType
}: ResourceCardProps) {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star text-yellow-400"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
    }
    
    return stars;
  };
  
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <div className="flex">
        <div className="bg-accent bg-opacity-10 rounded-lg p-3 mr-4">
          <i className={`fas fa-${iconType} text-accent`}></i>
        </div>
        <div className="flex-1">
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">
            {description}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>{duration}</span>
            <div className="flex items-center">
              <div className="flex">
                {renderStars(rating)}
              </div>
              <span className="ml-1">({ratingCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
