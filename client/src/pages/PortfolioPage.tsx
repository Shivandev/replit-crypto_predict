import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptocurrencies, fetchUserPortfolio } from "@/lib/apiClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatePortfolioDistribution, formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PortfolioPage() {
  // Update the page title
  useEffect(() => {
    document.title = "Portfolio | Cryptedict";
  }, []);
  
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  
  // Mock user ID (would normally come from auth context)
  const userId = 1;
  
  // Fetch user's portfolio
  const { data: portfolioData, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['/api/portfolios/user', userId],
    queryFn: () => fetchUserPortfolio(userId)
  });
  
  // Fetch cryptocurrencies for the add asset dialog
  const { data: cryptocurrencies, isLoading: isLoadingCryptos } = useQuery({
    queryKey: ['/api/cryptocurrencies'],
    queryFn: fetchCryptocurrencies
  });
  
  // Calculate portfolio metrics
  const totalInvestment = portfolioData?.reduce((sum, item) => sum + (item.quantity * item.buyPrice), 0) || 0;
  const currentValue = portfolioData?.reduce((sum, item) => {
    const crypto = cryptocurrencies?.find(c => c.id === item.cryptocurrencyId);
    return sum + (item.quantity * (crypto?.currentPrice || 0));
  }, 0) || 0;
  
  const totalProfit = currentValue - totalInvestment;
  const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
  
  // Calculate portfolio distribution for pie chart
  const distributionData = calculatePortfolioDistribution(
    portfolioData?.map(item => {
      const crypto = cryptocurrencies?.find(c => c.id === item.cryptocurrencyId);
      return {
        name: crypto?.name || 'Unknown',
        value: item.quantity * (crypto?.currentPrice || 0),
        symbol: crypto?.symbol || '???',
      };
    }) || []
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#FB6962'];
  
  // Form state for adding a new asset
  const [newAsset, setNewAsset] = useState({
    cryptocurrencyId: "",
    quantity: "",
    buyPrice: "",
    purchaseDate: ""
  });
  
  const handleChange = (field, value) => {
    setNewAsset({
      ...newAsset,
      [field]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally dispatch a mutation to add the asset
    console.log("Adding asset:", newAsset);
    setIsAddAssetOpen(false);
    // Reset form
    setNewAsset({
      cryptocurrencyId: "",
      quantity: "",
      buyPrice: "",
      purchaseDate: ""
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Portfolio</h1>
        <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
          <DialogTrigger asChild>
            <Button>Add Asset</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Asset to Portfolio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
                  <Select 
                    onValueChange={(value) => handleChange("cryptocurrencyId", value)}
                    value={newAsset.cryptocurrencyId}
                  >
                    <SelectTrigger id="cryptocurrency">
                      <SelectValue placeholder="Select Cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoadingCryptos && cryptocurrencies?.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id.toString()}>
                          {crypto.name} ({crypto.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0.00"
                    step="0.00000001"
                    value={newAsset.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="buyPrice">Buy Price (USD)</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={newAsset.buyPrice}
                    onChange={(e) => handleChange("buyPrice", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={newAsset.purchaseDate}
                    onChange={(e) => handleChange("purchaseDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add to Portfolio</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
            <p className={`text-sm ${profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(profitPercentage)} {profitPercentage >= 0 ? 'gain' : 'loss'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvestment)}</div>
            <p className="text-sm text-gray-500">Initial capital</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(totalProfit)}
            </div>
            <p className="text-sm text-gray-500">
              {totalProfit >= 0 ? 'Unrealized profit' : 'Unrealized loss'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Portfolio Distribution */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Asset Distribution</h2>
          <div className="h-[300px] w-full">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), "Value"]} 
                    labelFormatter={(name) => name}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No assets in portfolio. Add your first crypto asset!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Portfolio Performance */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Assets</h2>
          {isLoadingPortfolio || isLoadingCryptos ? (
            <p className="text-gray-500">Loading portfolio data...</p>
          ) : portfolioData?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your portfolio is empty</p>
              <Button onClick={() => setIsAddAssetOpen(true)}>Add Your First Asset</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Asset</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Avg. Buy</th>
                    <th className="text-right py-2">Current</th>
                    <th className="text-right py-2">Value</th>
                    <th className="text-right py-2">P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData?.map((item) => {
                    const crypto = cryptocurrencies?.find(c => c.id === item.cryptocurrencyId);
                    if (!crypto) return null;
                    
                    const buyValue = item.quantity * item.buyPrice;
                    const currentValue = item.quantity * crypto.currentPrice;
                    const profit = currentValue - buyValue;
                    const profitPercentage = (profit / buyValue) * 100;
                    
                    return (
                      <tr key={item.id} className="border-b dark:border-gray-700">
                        <td className="py-3 flex items-center">
                          <div className="flex items-center">
                            <div className="mr-2 text-xl">
                              {crypto.symbol === 'BTC' && '₿'}
                              {crypto.symbol === 'ETH' && 'Ξ'}
                              {crypto.symbol === 'SOL' && 'Ⓢ'}
                            </div>
                            <div>
                              <div className="font-medium">{crypto.name}</div>
                              <div className="text-xs text-gray-500">{crypto.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3">
                          {Number(item.quantity).toLocaleString(undefined, { 
                            minimumFractionDigits: 0, 
                            maximumFractionDigits: 8 
                          })}
                        </td>
                        <td className="text-right py-3">{formatCurrency(item.buyPrice)}</td>
                        <td className="text-right py-3">{formatCurrency(crypto.currentPrice)}</td>
                        <td className="text-right py-3">{formatCurrency(currentValue)}</td>
                        <td className={`text-right py-3 ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(profitPercentage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="buys">Buys</TabsTrigger>
              <TabsTrigger value="sells">Sells</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {portfolioData?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Asset</th>
                      <th className="text-right py-2">Type</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Quantity</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData?.map((item) => {
                      const crypto = cryptocurrencies?.find(c => c.id === item.cryptocurrencyId);
                      if (!crypto) return null;
                      
                      return (
                        <tr key={item.id} className="border-b dark:border-gray-700">
                          <td className="py-3">{new Date(item.purchaseDate || "2023-01-01").toLocaleDateString()}</td>
                          <td className="py-3">{crypto.name} ({crypto.symbol})</td>
                          <td className="text-right py-3 text-green-500">Buy</td>
                          <td className="text-right py-3">{formatCurrency(item.buyPrice)}</td>
                          <td className="text-right py-3">{Number(item.quantity).toLocaleString()}</td>
                          <td className="text-right py-3">{formatCurrency(item.quantity * item.buyPrice)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="buys" className="mt-0">
            {portfolioData?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No buy transactions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Asset</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Quantity</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData?.map((item) => {
                      const crypto = cryptocurrencies?.find(c => c.id === item.cryptocurrencyId);
                      if (!crypto) return null;
                      
                      return (
                        <tr key={item.id} className="border-b dark:border-gray-700">
                          <td className="py-3">{new Date(item.purchaseDate || "2023-01-01").toLocaleDateString()}</td>
                          <td className="py-3">{crypto.name} ({crypto.symbol})</td>
                          <td className="text-right py-3">{formatCurrency(item.buyPrice)}</td>
                          <td className="text-right py-3">{Number(item.quantity).toLocaleString()}</td>
                          <td className="text-right py-3">{formatCurrency(item.quantity * item.buyPrice)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sells" className="mt-0">
            <p className="text-gray-500 text-center py-8">No sell transactions yet</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
