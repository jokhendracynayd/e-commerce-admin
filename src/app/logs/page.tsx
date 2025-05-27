import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Download, Filter, RefreshCcw, Search } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

const logs = [
  {
    id: "log-001",
    timestamp: "2023-08-15 14:32:45",
    user: "admin@example.com",
    action: "User Login",
    ip: "192.168.1.1",
    status: "Success",
    details: "Successfully authenticated",
  },
  {
    id: "log-002",
    timestamp: "2023-08-15 14:35:12",
    user: "admin@example.com",
    action: "Product Update",
    ip: "192.168.1.1",
    status: "Success",
    details: "Updated product ID: PRD-5312",
  },
  {
    id: "log-003",
    timestamp: "2023-08-15 14:40:23",
    user: "marketing@example.com",
    action: "Promotion Created",
    ip: "192.168.1.5",
    status: "Success",
    details: "Created promotion: Summer Sale",
  },
  {
    id: "log-004",
    timestamp: "2023-08-15 15:03:17",
    user: "unknown",
    action: "Failed Login Attempt",
    ip: "203.0.113.45",
    status: "Failed",
    details: "Invalid credentials",
  },
  {
    id: "log-005",
    timestamp: "2023-08-15 15:12:54",
    user: "support@example.com",
    action: "Order Status Change",
    ip: "192.168.1.8",
    status: "Success",
    details: "Order #5314 marked as Shipped",
  },
  {
    id: "log-006",
    timestamp: "2023-08-15 15:30:01",
    user: "system",
    action: "Database Backup",
    ip: "localhost",
    status: "Success",
    details: "Automated daily backup completed",
  },
  {
    id: "log-007",
    timestamp: "2023-08-15 15:45:12",
    user: "admin@example.com",
    action: "User Permission Update",
    ip: "192.168.1.1",
    status: "Success",
    details: "Updated permissions for marketing@example.com",
  },
  {
    id: "log-008",
    timestamp: "2023-08-15 15:52:38",
    user: "system",
    action: "API Rate Limit Exceeded",
    ip: "203.0.113.100",
    status: "Warning",
    details: "Rate limit reached for inventory API",
  },
  {
    id: "log-009",
    timestamp: "2023-08-15 16:03:45",
    user: "finance@example.com",
    action: "Invoice Generated",
    ip: "192.168.1.12",
    status: "Success",
    details: "Generated invoice #INV-2023-415",
  },
  {
    id: "log-010",
    timestamp: "2023-08-15 16:14:22",
    user: "system",
    action: "Low Stock Alert",
    ip: "localhost",
    status: "Warning",
    details: "Product ID: PRD-3214 below threshold",
  },
];

export default function LogsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Logs</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-9 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" className="h-9">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Logs Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">154</div>
              <p className="text-xs text-muted-foreground">+12 in the last hour</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">97.2%</div>
              <p className="text-xs text-muted-foreground">+0.5% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Error Logs</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">-2 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Warning Logs</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Activity Logs</CardTitle>
            <CardDescription>
              Recent system activity and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[300px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        log.status === "Success" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : log.status === "Warning"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}>
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing <strong>10</strong> of <strong>154</strong> entries
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Log Types Distribution</CardTitle>
              <CardDescription>
                Breakdown of system log entries by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "User Authentication", count: 45, percent: 30 },
                  { type: "Data Modifications", count: 36, percent: 24 },
                  { type: "System Operations", count: 30, percent: 20 },
                  { type: "API Interactions", count: 24, percent: 16 },
                  { type: "Security Events", count: 15, percent: 10 },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{item.type}</div>
                      <div className="text-sm font-medium">{item.count}</div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${item.percent}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Log Retention Policy</CardTitle>
              <CardDescription>
                Current data retention settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    name: "System Logs", 
                    retention: "30 days", 
                    description: "Authentication, system events, and errors"
                  },
                  { 
                    name: "Security Logs", 
                    retention: "90 days", 
                    description: "User permissions, suspicious activity" 
                  },
                  { 
                    name: "Transaction Logs", 
                    retention: "365 days", 
                    description: "Order and payment processing events" 
                  },
                  { 
                    name: "Activity Logs", 
                    retention: "60 days", 
                    description: "User actions and data modifications" 
                  },
                ].map((policy, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted mt-1 mr-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{policy.name}</div>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {policy.retention}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{policy.description}</div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2">
                  Configure Retention Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 