import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchResources } from "@/lib/apiClient";
import ResourceCard from "@/components/dashboard/ResourceCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function LearnPage() {
  // Update the page title
  useEffect(() => {
    document.title = "Crypto Studio | Cryptedict";
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Fetch resources
  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: fetchResources
  });
  
  // Filter resources based on search term and filters
  const filteredResources = resources?.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === "all" || resource.level === difficultyFilter;
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    
    return matchesSearch && matchesDifficulty && matchesType;
  });
  
  // Group resources by level
  const beginnerResources = filteredResources?.filter(r => r.level === "beginner");
  const intermediateResources = filteredResources?.filter(r => r.level === "intermediate");
  const advancedResources = filteredResources?.filter(r => r.level === "advanced");
  
  // Mock completed courses (this would normally come from user data)
  const completedCourses = ["Crypto Basics", "Blockchain 101"];
  const inProgressCourses = ["Technical Analysis"];
  const savedResources = ["DeFi Explained", "NFT Marketplaces"];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Crypto Studio</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative rounded-md shadow-sm">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="difficulty-filter" className="block text-sm font-medium mb-1">
                  Difficulty Level
                </label>
                <Select 
                  onValueChange={setDifficultyFilter}
                  defaultValue="all"
                >
                  <SelectTrigger id="difficulty-filter">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium mb-1">
                  Content Type
                </label>
                <Select 
                  onValueChange={setTypeFilter}
                  defaultValue="all"
                >
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                    <SelectItem value="tutorial">Tutorials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">My Learning</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">In Progress</h3>
                {inProgressCourses.length > 0 ? (
                  <div className="space-y-3">
                    {inProgressCourses.map((course, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>{course}</span>
                          <span className="text-xs text-gray-500">60%</span>
                        </div>
                        <Progress value={60} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No courses in progress</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Completed</h3>
                {completedCourses.length > 0 ? (
                  <div className="space-y-2">
                    {completedCourses.map((course, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No completed courses yet</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Saved</h3>
                {savedResources.length > 0 ? (
                  <div className="space-y-2">
                    {savedResources.map((resource, index) => (
                      <div key={index} className="text-sm flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span>{resource}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No saved resources</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm">
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                </svg>
                Learning Path
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Loading resources...</p>
                </div>
              ) : filteredResources?.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    No resources found matching your search criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <h2 className="font-semibold">Recommended For You</h2>
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                      {filteredResources?.slice(0, 3).map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          description={resource.description}
                          type={resource.type}
                          duration={resource.duration}
                          rating={resource.rating}
                          ratingCount={resource.ratingCount}
                          iconType={resource.type === "video" ? "play-circle" : resource.type === "article" ? "file-text" : "book"}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <h2 className="font-semibold">Popular Resources</h2>
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                      {filteredResources?.slice(3, 6).map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          description={resource.description}
                          type={resource.type}
                          duration={resource.duration}
                          rating={resource.rating}
                          ratingCount={resource.ratingCount}
                          iconType={resource.type === "video" ? "play-circle" : resource.type === "article" ? "file-text" : "book"}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <h2 className="font-semibold">Latest Resources</h2>
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                      {filteredResources?.slice(6).map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          description={resource.description}
                          type={resource.type}
                          duration={resource.duration}
                          rating={resource.rating}
                          ratingCount={resource.ratingCount}
                          iconType={resource.type === "video" ? "play-circle" : resource.type === "article" ? "file-text" : "book"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="beginner" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Loading resources...</p>
                </div>
              ) : beginnerResources?.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    No beginner resources found matching your search criteria.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="flex items-center">
                      <h2 className="font-semibold">Beginner Resources</h2>
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">Easy</Badge>
                    </div>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {beginnerResources?.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        title={resource.title}
                        description={resource.description}
                        type={resource.type}
                        duration={resource.duration}
                        rating={resource.rating}
                        ratingCount={resource.ratingCount}
                        iconType={resource.type === "video" ? "play-circle" : resource.type === "article" ? "file-text" : "book"}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="intermediate" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Loading resources...</p>
                </div>
              ) : intermediateResources?.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    No intermediate resources found matching your search criteria.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="flex items-center">
                      <h2 className="font-semibold">Intermediate Resources</h2>
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>
                    </div>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {intermediateResources?.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        title={resource.title}
                        description={resource.description}
                        type={resource.type}
                        duration={resource.duration}
                        rating={resource.rating}
                        ratingCount={resource.ratingCount}
                        iconType={resource.type === "video" ? "play-circle" : resource.type === "article" ? "file-text" : "book"}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Loading resources...</p>
                </div>
              ) : advancedResources?.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    No advanced resources found matching your search criteria.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="flex items-center">
                      <h2 className="font-semibold">Advanced Resources</h2>
                      <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">Hard</Badge>
                    </div>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {advancedResources?.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        title={resource.title}
                        description={resource.description}
                        type={resource.type}
                        duration={resource.duration}
                        rating={resource.rating}
                        ratingCount={resource.ratingCount}
                        iconType={resource.type === "video" ? "play-circle" : resource.type === "article" ? "file-text" : "book"}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
