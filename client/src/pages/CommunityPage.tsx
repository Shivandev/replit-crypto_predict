import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiscussions, fetchHotDiscussions } from "@/lib/apiClient";
import DiscussionCard from "@/components/dashboard/DiscussionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function CommunityPage() {
  // Update the page title
  useEffect(() => {
    document.title = "Community | Cryptedict";
  }, []);
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch discussions
  const { data: discussions, isLoading: isLoadingDiscussions } = useQuery({
    queryKey: ['/api/discussions'],
    queryFn: fetchDiscussions
  });
  
  // Fetch hot discussions
  const { data: hotDiscussions, isLoading: isLoadingHotDiscussions } = useQuery({
    queryKey: ['/api/discussions/hot'],
    queryFn: fetchHotDiscussions
  });
  
  // Filter discussions based on search term
  const filteredDiscussions = discussions?.filter(discussion => 
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // New post form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: ""
  });
  
  const handleChange = (field, value) => {
    setNewPost({
      ...newPost,
      [field]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally dispatch a mutation to create the post
    console.log("Creating post:", newPost);
    setIsCreatePostOpen(false);
    // Reset form
    setNewPost({
      title: "",
      content: "",
      tags: ""
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Community</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative rounded-md shadow-sm max-w-sm">
            <Input
              type="text"
              placeholder="Search discussions..."
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
          
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="post-title" className="text-sm font-medium">Title</label>
                    <Input
                      id="post-title"
                      placeholder="Enter a descriptive title"
                      value={newPost.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="post-content" className="text-sm font-medium">Content</label>
                    <Textarea
                      id="post-content"
                      placeholder="Share your thoughts, questions, or ideas..."
                      rows={6}
                      value={newPost.content}
                      onChange={(e) => handleChange("content", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="post-tags" className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      id="post-tags"
                      placeholder="bitcoin, trading, analysis"
                      value={newPost.tags}
                      onChange={(e) => handleChange("tags", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsCreatePostOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Post</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="hot">Hot Topics</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {isLoadingDiscussions ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Loading discussions...</p>
                </div>
              ) : filteredDiscussions?.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {searchTerm ? "No discussions found matching your search." : "No discussions yet."}
                  </p>
                  <Button onClick={() => setIsCreatePostOpen(true)}>
                    Start the First Discussion
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 bg-white dark:bg-gray-800 shadow rounded-lg divide-y dark:divide-gray-700">
                  {filteredDiscussions?.map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      title={discussion.title}
                      content={discussion.content}
                      author={`User${discussion.userId}`}
                      commentCount={discussion.commentCount || 0}
                      upvotes={discussion.upvotes || 0}
                      isHot={discussion.isHot}
                      isTrending={discussion.isTrending}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hot" className="mt-0">
              {isLoadingHotDiscussions ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Loading hot topics...</p>
                </div>
              ) : (
                <div className="space-y-1 bg-white dark:bg-gray-800 shadow rounded-lg divide-y dark:divide-gray-700">
                  {hotDiscussions?.map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      title={discussion.title}
                      content={discussion.content}
                      author={`User${discussion.userId}`}
                      commentCount={discussion.commentCount || 0}
                      upvotes={discussion.upvotes || 0}
                      isHot={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Trending discussions will appear here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="following" className="mt-0">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  You'll see posts from users you follow here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Community Guidelines</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
              <p>Welcome to the Cryptedict community! Please follow these guidelines:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Be respectful and constructive in your comments</li>
                <li>Don't share personal trading account details</li>
                <li>Check your facts before posting market information</li>
                <li>No spam, promotional content, or harassment</li>
                <li>Tag your posts appropriately for better visibility</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#bitcoin</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#ethereum</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#trading</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#defi</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#nft</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#analysis</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#regulation</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">#altcoins</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-lg font-semibold">
                  JD
                </div>
                <div>
                  <p className="font-medium">JaneDoe</p>
                  <p className="text-xs text-gray-500">143 posts • 532 comments</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-lg font-semibold">
                  CS
                </div>
                <div>
                  <p className="font-medium">CryptoSage</p>
                  <p className="text-xs text-gray-500">87 posts • 324 comments</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-lg font-semibold">
                  BH
                </div>
                <div>
                  <p className="font-medium">BlockHunter</p>
                  <p className="text-xs text-gray-500">64 posts • 218 comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
