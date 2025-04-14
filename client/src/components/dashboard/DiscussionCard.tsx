interface DiscussionCardProps {
  title: string;
  content: string;
  author: string;
  commentCount: number;
  upvotes: number;
  isHot?: boolean;
  isTrending?: boolean;
}

export default function DiscussionCard({
  title,
  content,
  author,
  commentCount,
  upvotes,
  isHot,
  isTrending
}: DiscussionCardProps) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">{title}</h4>
        {isHot && (
          <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
            Hot Topic
          </span>
        )}
        {isTrending && (
          <span className="text-xs bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded">
            Trending
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
        {content}
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <img 
            className="h-5 w-5 rounded-full mr-1" 
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50&q=80" 
            alt="User avatar" 
          />
          <span>by {author}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <i className="far fa-comment mr-1"></i>
            {commentCount}
          </span>
          <span className="flex items-center">
            <i className="far fa-heart mr-1"></i>
            {upvotes}
          </span>
        </div>
      </div>
    </div>
  );
}
