import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptocurrencies } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

// Mock data for alerts (would normally come from API)
const mockAlerts = [
  { 
    id: 1, 
    type: "price",
    cryptocurrencyId: 1, // Bitcoin
    condition: "below",
    price: 40000,
    notifyVia: ["email", "push"],
    isActive: true,
    createdAt: "2023-03-15T12:00:00Z"
  },
  { 
    id: 2, 
    type: "price",
    cryptocurrencyId: 2, // Ethereum
    condition: "above",
    price: 3000,
    notifyVia: ["push"],
    isActive: true,
    createdAt: "2023-03-16T14:30:00Z"
  },
  { 
    id: 3, 
    type: "prediction",
    cryptocurrencyId: 1, // Bitcoin
    condition: "bullish",
    confidence: 80,
    notifyVia: ["email"],
    isActive: false,
    createdAt: "2023-03-17T09:15:00Z"
  }
];

// Mock data for alert history
const mockAlertHistory = [
  {
    id: 101,
    alertId: 1,
    cryptocurrencyId: 1,
    message: "Bitcoin price fell below $40,000",
    triggeredAt: "2023-03-20T08:45:00Z"
  },
  {
    id: 102,
    alertId: 2,
    cryptocurrencyId: 2,
    message: "Ethereum price rose above $3,000",
    triggeredAt: "2023-03-18T12:20:00Z"
  }
];

export default function AlertsPage() {
  // Update the page title
  useEffect(() => {
    document.title = "Alerts | Cryptedict";
  }, []);
  
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(mockAlerts);
  const [alertHistory, setAlertHistory] = useState(mockAlertHistory);
  
  // Fetch cryptocurrencies for dropdown
  const { data: cryptocurrencies, isLoading: isLoadingCryptos } = useQuery({
    queryKey: ['/api/cryptocurrencies'],
    queryFn: fetchCryptocurrencies
  });
  
  // Form state for new alert
  const [newAlert, setNewAlert] = useState({
    type: "price",
    cryptocurrencyId: "",
    condition: "above",
    price: "",
    confidence: "70",
    notifyVia: ["push"],
    isActive: true
  });
  
  const handleChange = (field: string, value: any) => {
    setNewAlert({
      ...newAlert,
      [field]: value
    });
  };
  
  const toggleNotification = (method: string) => {
    const currentMethods = [...newAlert.notifyVia];
    if (currentMethods.includes(method)) {
      handleChange("notifyVia", currentMethods.filter(m => m !== method));
    } else {
      handleChange("notifyVia", [...currentMethods, method]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally dispatch a mutation to create the alert
    console.log("Creating alert:", newAlert);
    
    // Add to mock alerts (for demo)
    const mockNewAlert = {
      id: activeAlerts.length + 4,
      ...newAlert,
      price: Number(newAlert.price),
      confidence: Number(newAlert.confidence),
      createdAt: new Date().toISOString()
    };
    setActiveAlerts([...activeAlerts, mockNewAlert]);
    
    setIsCreateAlertOpen(false);
    // Reset form
    setNewAlert({
      type: "price",
      cryptocurrencyId: "",
      condition: "above",
      price: "",
      confidence: "70",
      notifyVia: ["push"],
      isActive: true
    });
  };
  
  const toggleAlertStatus = (alertId: number) => {
    setActiveAlerts(alerts => alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };
  
  const deleteAlert = (alertId: number) => {
    setActiveAlerts(alerts => alerts.filter(alert => alert.id !== alertId));
  };
  
  // Get cryptocurrency by ID
  const getCryptocurrencyById = (id: number) => {
    return cryptocurrencies?.find(crypto => crypto.id === id);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Price Alerts</h1>
        <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
          <DialogTrigger asChild>
            <Button>Create Alert</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
              <DialogDescription>
                Get notified when cryptocurrencies reach specific price points or when our AI model predicts significant movements.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <RadioGroup 
                    id="alert-type" 
                    value={newAlert.type} 
                    onValueChange={(value) => handleChange("type", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price" id="price" />
                      <Label htmlFor="price">Price Alert</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prediction" id="prediction" />
                      <Label htmlFor="prediction">Prediction Alert</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
                  <Select 
                    onValueChange={(value) => handleChange("cryptocurrencyId", value)}
                    value={newAlert.cryptocurrencyId}
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
                
                {newAlert.type === "price" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select 
                        onValueChange={(value) => handleChange("condition", value)}
                        defaultValue="above"
                      >
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">Price Above</SelectItem>
                          <SelectItem value="below">Price Below</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={newAlert.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="prediction-type">Prediction Type</Label>
                      <Select 
                        onValueChange={(value) => handleChange("condition", value)}
                        defaultValue="bullish"
                      >
                        <SelectTrigger id="prediction-type">
                          <SelectValue placeholder="Select Prediction Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bullish">Bullish (Price Rise)</SelectItem>
                          <SelectItem value="bearish">Bearish (Price Drop)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confidence">
                        Minimum Confidence ({newAlert.confidence}%)
                      </Label>
                      <Input
                        id="confidence"
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={newAlert.confidence}
                        onChange={(e) => handleChange("confidence", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Alert will trigger only when AI prediction confidence is at least {newAlert.confidence}%
                      </p>
                    </div>
                  </>
                )}
                
                <div className="grid gap-2">
                  <Label>Notification Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notify-email" 
                        checked={newAlert.notifyVia.includes("email")} 
                        onCheckedChange={() => toggleNotification("email")}
                      />
                      <Label htmlFor="notify-email">Email Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notify-push" 
                        checked={newAlert.notifyVia.includes("push")} 
                        onCheckedChange={() => toggleNotification("push")}
                      />
                      <Label htmlFor="notify-push">Push Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notify-sms" 
                        checked={newAlert.notifyVia.includes("sms")} 
                        onCheckedChange={() => toggleNotification("sms")}
                      />
                      <Label htmlFor="notify-sms">SMS Notifications</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Alert</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-0">
          {activeAlerts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create your first price alert to get notified when cryptocurrencies reach specific price points.
              </p>
              <Button onClick={() => setIsCreateAlertOpen(true)}>Create Your First Alert</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAlerts.map((alert) => {
                const crypto = getCryptocurrencyById(alert.cryptocurrencyId);
                return (
                  <Card key={alert.id} className={!alert.isActive ? "opacity-75" : undefined}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            {crypto?.symbol} {alert.type === "price" ? "Price Alert" : "Prediction Alert"}
                            {!alert.isActive && <span className="ml-2 text-xs text-gray-500">(Paused)</span>}
                          </CardTitle>
                          <CardDescription>{crypto?.name}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Switch 
                            checked={alert.isActive} 
                            onCheckedChange={() => toggleAlertStatus(alert.id)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {alert.type === "price" ? (
                        <div className="flex items-center text-lg font-semibold">
                          {alert.condition === "above" ? (
                            <span className="text-green-600 dark:text-green-400">↗ Above {formatCurrency(alert.price)}</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">↘ Below {formatCurrency(alert.price)}</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-lg font-semibold">
                          {alert.condition === "bullish" ? (
                            <span className="text-green-600 dark:text-green-400">↗ Bullish prediction</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">↘ Bearish prediction</span>
                          )}
                          <span className="ml-2 text-sm font-normal">
                            (min {alert.confidence}% confidence)
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span>Notify via: </span>
                          <div className="flex ml-1 space-x-1">
                            {alert.notifyVia.includes("email") && (
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Email</span>
                            )}
                            {alert.notifyVia.includes("push") && (
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Push</span>
                            )}
                            {alert.notifyVia.includes("sms") && (
                              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">SMS</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 border-t dark:border-gray-700">
                      <span className="text-xs text-gray-500">
                        Created {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          {activeAlerts.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => setIsCreateAlertOpen(true)}>
                Add Another Alert
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          {alertHistory.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No alerts have been triggered yet. Your alert history will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cryptocurrency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Alert Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {alertHistory.map((historyItem) => {
                    const crypto = getCryptocurrencyById(historyItem.cryptocurrencyId);
                    return (
                      <tr key={historyItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(historyItem.triggeredAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {crypto?.name} ({crypto?.symbol})
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                          {historyItem.message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About Price Alerts</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Cryptedict's alert system allows you to stay informed about important market movements and opportunities without constantly watching the markets.
          </p>
          <h3>Types of Alerts</h3>
          <ul>
            <li>
              <strong>Price Alerts:</strong> Get notified when a cryptocurrency reaches a specific price point, either rising above or falling below your target.
            </li>
            <li>
              <strong>Prediction Alerts:</strong> Receive notifications when our AI model predicts significant price movements with your specified confidence threshold.
            </li>
          </ul>
          <h3>Notification Methods</h3>
          <p>
            Choose how you want to be notified:
          </p>
          <ul>
            <li>Email notifications</li>
            <li>Push notifications (on browser or mobile app)</li>
            <li>SMS notifications (requires phone verification)</li>
          </ul>
          <p>
            You can customize notification settings for each individual alert based on its importance to your trading strategy.
          </p>
        </div>
      </div>
    </div>
  );
}
