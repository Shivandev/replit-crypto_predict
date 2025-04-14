import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DiscussionCard from "./DiscussionCard";
import ResourceCard from "./ResourceCard";
import { type Discussion, type Resource } from "@shared/schema";

export default function CommunityInsights() {
  // Fetch hot discussions
  const { data: discussions, isLoading: isLoadingDiscussions } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions/hot"],
  });
  
  // Fetch educational resources
  const { data: resources, isLoading: isLoadingResources } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Community Insights</h2>
        <Link href="/community">
          <a className="text-primary dark:text-primary text-sm font-medium flex items-center">
            View All
            <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Discussions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold">Trending Discussions</h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoadingDiscussions ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-4 animate-pulse">
                  <div className="flex justify-between mb-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : discussions && discussions.length > 0 ? (
              discussions.map(discussion => (
                <DiscussionCard
                  key={discussion.id}
                  title={discussion.title}
                  content={discussion.content}
                  author="User" // Would include author info in a real app
                  commentCount={discussion.commentCount}
                  upvotes={discussion.upvotes}
                  isHot={discussion.isHot}
                  isTrending={discussion.isTrending}
                />
              ))
            ) : (
              <div className="p-4 text-center">No discussions found</div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <button className="text-primary dark:text-primary text-sm font-medium">
              Start New Discussion
            </button>
          </div>
        </div>
        
        {/* Learning Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold">Educational Resources</h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoadingResources ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-4 animate-pulse">
                  <div className="flex">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : resources && resources.length > 0 ? (
              resources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  description={resource.description}
                  type={resource.type}
                  duration={resource.duration || ""}
                  rating={resource.rating || 0}
                  ratingCount={resource.ratingCount || 0}
                  iconType={resource.iconType}
                />
              ))
            ) : (
              <div className="p-4 text-center">No resources found</div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <button className="text-primary dark:text-primary text-sm font-medium">
              Browse Learning Center
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
