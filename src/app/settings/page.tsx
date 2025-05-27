import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/components/MainLayout";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your store information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue="Brand Store" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-email">Store Email</Label>
                  <Input id="store-email" type="email" defaultValue="contact@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Store Phone</Label>
                  <Input id="store-phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input id="store-address" defaultValue="123 Commerce St, City, Country" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateways</CardTitle>
                <CardDescription>
                  Configure your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Credit Cards (Stripe)</p>
                      <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, Amex</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">Enabled</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">Enabled</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Apple Pay</p>
                      <p className="text-sm text-muted-foreground">Accept payments with Apple Pay</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Disabled</span>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipping Methods</CardTitle>
                <CardDescription>
                  Configure your shipping options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Standard Shipping</p>
                      <p className="text-sm text-muted-foreground">3-5 business days</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$5.99</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Express Shipping</p>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$12.99</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-muted-foreground">Orders over $50</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$0.00</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">Add Shipping Method</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Configuration</CardTitle>
                <CardDescription>
                  Additional store settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <div className="bg-muted px-3 py-2 text-sm text-muted-foreground">
                      Currency
                    </div>
                    <select 
                      id="currency" 
                      className="w-full px-3 py-2 border-none focus:outline-none bg-transparent"
                      defaultValue="USD"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="7.5" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order-prefix">Order Number Prefix</Label>
                  <Input id="order-prefix" defaultValue="ORD-" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure email alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input type="checkbox" id="new-order" defaultChecked />
                    <Label htmlFor="new-order" className="font-normal">New Order</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input type="checkbox" id="low-stock" defaultChecked />
                    <Label htmlFor="low-stock" className="font-normal">Low Stock Alert</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input type="checkbox" id="customer-register" defaultChecked />
                    <Label htmlFor="customer-register" className="font-normal">New Customer Registration</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input type="checkbox" id="product-review" defaultChecked />
                    <Label htmlFor="product-review" className="font-normal">New Product Review</Label>
                  </div>
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input type="checkbox" id="two-factor" />
                    <Label htmlFor="two-factor" className="font-normal">Two-Factor Authentication</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <input type="checkbox" id="session-timeout" defaultChecked />
                    <Label htmlFor="session-timeout" className="font-normal">Session Timeout (30min)</Label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">Security Audit Log</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 