import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Ban,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

type Section =
  | "overview"
  | "users"
  | "income"
  | "jobs"
  | "communications"
  | "settings";

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "users",
    label: "User Management",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "income",
    label: "Income & Ledger",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "jobs",
    label: "Job Listings",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "communications",
    label: "Client Communications",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

const KPI_CARDS = [
  {
    title: "Total Users",
    value: "1,284",
    change: "+12%",
    up: true,
    icon: <Users className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    title: "Total Providers",
    value: "438",
    change: "+8%",
    up: true,
    icon: <UserCheck className="w-5 h-5" />,
    color: "text-emerald-600",
  },
  {
    title: "Total Takers",
    value: "846",
    change: "+15%",
    up: true,
    icon: <Search className="w-5 h-5" />,
    color: "text-violet-600",
  },
  {
    title: "Active Jobs",
    value: "217",
    change: "-3%",
    up: false,
    icon: <Briefcase className="w-5 h-5" />,
    color: "text-amber-600",
  },
  {
    title: "Total Bookings",
    value: "5,902",
    change: "+24%",
    up: true,
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-rose-600",
  },
  {
    title: "Total Revenue",
    value: "$128,450",
    change: "+18%",
    up: true,
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-teal-600",
  },
];

const ACTIVITY_FEED = [
  {
    user: "Sarah Mitchell",
    action: "booked a Web Design session with James Carter",
    time: "2 min ago",
    type: "booking",
  },
  {
    user: "Carlos Rivera",
    action: "joined as a new Service Provider",
    time: "14 min ago",
    type: "join",
  },
  {
    user: "Emma Thompson",
    action: "left a 5-star review for Priya Sharma",
    time: "31 min ago",
    type: "review",
  },
  {
    user: "Admin",
    action: "suspended account lspam2024 for policy violations",
    time: "1 hr ago",
    type: "admin",
  },
  {
    user: "David Park",
    action: "completed payment of $320 for SEO Consulting",
    time: "2 hr ago",
    type: "payment",
  },
  {
    user: "Natalie Brooks",
    action: "registered as a new Taker",
    time: "3 hr ago",
    type: "join",
  },
];

const USERS_DATA = [
  {
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    type: "Taker",
    status: "Active",
    joined: "Jan 12, 2025",
  },
  {
    name: "James Carter",
    email: "james.c@email.com",
    type: "Provider",
    status: "Active",
    joined: "Mar 3, 2025",
  },
  {
    name: "Carlos Rivera",
    email: "carlos.r@email.com",
    type: "Provider",
    status: "Active",
    joined: "Apr 28, 2025",
  },
  {
    name: "Emma Thompson",
    email: "emma.t@email.com",
    type: "Both",
    status: "Active",
    joined: "Feb 17, 2025",
  },
  {
    name: "Priya Sharma",
    email: "priya.s@email.com",
    type: "Provider",
    status: "Active",
    joined: "May 9, 2025",
  },
  {
    name: "David Park",
    email: "david.p@email.com",
    type: "Taker",
    status: "Active",
    joined: "Jun 1, 2025",
  },
  {
    name: "Natalie Brooks",
    email: "natalie.b@email.com",
    type: "Taker",
    status: "Active",
    joined: "Jun 15, 2025",
  },
  {
    name: "lspam2024",
    email: "spammy@disposable.io",
    type: "Taker",
    status: "Suspended",
    joined: "Jun 20, 2025",
  },
  {
    name: "Alex Nguyen",
    email: "alex.n@email.com",
    type: "Both",
    status: "Active",
    joined: "Jul 2, 2025",
  },
  {
    name: "Jessica Flores",
    email: "jess.f@email.com",
    type: "Provider",
    status: "Active",
    joined: "Jul 10, 2025",
  },
];

const INCOME_CATEGORIES = [
  {
    code: "INC-001",
    name: "Consulting",
    description: "Business and strategy consulting services",
    total: "$42,800",
  },
  {
    code: "INC-002",
    name: "Design",
    description: "UI/UX, graphic, and brand design work",
    total: "$31,200",
  },
  {
    code: "INC-003",
    name: "Development",
    description: "Web and mobile software development",
    total: "$28,950",
  },
  {
    code: "INC-004",
    name: "Marketing",
    description: "Digital marketing, SEO, and social media",
    total: "$15,400",
  },
  {
    code: "INC-005",
    name: "Writing",
    description: "Copywriting, content, and technical writing",
    total: "$10,100",
  },
];

const GL_ENTRIES = [
  {
    date: "Jul 1, 2025",
    ref: "GL-0041",
    description: "Platform fee — June batch",
    debit: "$2,450",
    credit: "",
    balance: "$82,340",
  },
  {
    date: "Jul 3, 2025",
    ref: "GL-0042",
    description: "Payout to James Carter",
    debit: "",
    credit: "$1,200",
    balance: "$81,140",
  },
  {
    date: "Jul 5, 2025",
    ref: "GL-0043",
    description: "Booking revenue batch #22",
    debit: "$5,800",
    credit: "",
    balance: "$86,940",
  },
  {
    date: "Jul 8, 2025",
    ref: "GL-0044",
    description: "Payout to Priya Sharma",
    debit: "",
    credit: "$980",
    balance: "$85,960",
  },
  {
    date: "Jul 10, 2025",
    ref: "GL-0045",
    description: "Refund — cancelled booking",
    debit: "",
    credit: "$150",
    balance: "$85,810",
  },
  {
    date: "Jul 12, 2025",
    ref: "GL-0046",
    description: "Booking revenue batch #23",
    debit: "$4,200",
    credit: "",
    balance: "$90,010",
  },
];

const VENDOR_INCOME = [
  {
    vendor: "James Carter",
    service: "Web Design Package",
    amount: "$1,200",
    date: "Jul 3, 2025",
    status: "Paid",
  },
  {
    vendor: "Priya Sharma",
    service: "SEO Consulting 3-Month",
    amount: "$980",
    date: "Jul 8, 2025",
    status: "Paid",
  },
  {
    vendor: "Carlos Rivera",
    service: "Brand Identity Design",
    amount: "$2,400",
    date: "Jul 15, 2025",
    status: "Pending",
  },
  {
    vendor: "Alex Nguyen",
    service: "React App Development",
    amount: "$5,500",
    date: "Jul 18, 2025",
    status: "Pending",
  },
  {
    vendor: "Jessica Flores",
    service: "Content Strategy",
    amount: "$650",
    date: "Jul 20, 2025",
    status: "Paid",
  },
];

const JOB_LISTINGS = [
  {
    title: "Full-Stack Web Development",
    provider: "Alex Nguyen",
    category: "Development",
    price: "$120/hr",
    status: "Active",
    created: "May 10, 2025",
  },
  {
    title: "UI/UX Design Sprint",
    provider: "James Carter",
    category: "Design",
    price: "$90/hr",
    status: "Active",
    created: "May 22, 2025",
  },
  {
    title: "SEO Audit & Strategy",
    provider: "Priya Sharma",
    category: "Marketing",
    price: "$350/mo",
    status: "Active",
    created: "Jun 1, 2025",
  },
  {
    title: "Instagram Growth Management",
    provider: "Jessica Flores",
    category: "Marketing",
    price: "$500/mo",
    status: "Inactive",
    created: "Jun 5, 2025",
  },
  {
    title: "Business Strategy Consulting",
    provider: "Carlos Rivera",
    category: "Consulting",
    price: "$200/hr",
    status: "Active",
    created: "Jun 12, 2025",
  },
  {
    title: "Technical Writing Services",
    provider: "Emma Thompson",
    category: "Writing",
    price: "$75/hr",
    status: "Active",
    created: "Jun 20, 2025",
  },
  {
    title: "Logo & Brand Identity",
    provider: "James Carter",
    category: "Design",
    price: "$1,200 flat",
    status: "Active",
    created: "Jul 1, 2025",
  },
  {
    title: "WordPress Site Setup",
    provider: "Natalie Brooks",
    category: "Development",
    price: "$800 flat",
    status: "Inactive",
    created: "Jul 5, 2025",
  },
];

const COMMUNICATIONS = [
  {
    from: "Sarah Mitchell",
    subject: "Issue with booking cancellation refund",
    date: "Jul 14, 2025",
    status: "New",
    preview:
      "Hi, I cancelled my session 3 days ago but haven't received my refund...",
  },
  {
    from: "David Park",
    subject: "Provider not responding",
    date: "Jul 13, 2025",
    status: "Read",
    preview:
      "I booked a design consultation last week but the provider hasn't confirmed...",
  },
  {
    from: "Carlos Rivera",
    subject: "Payment dashboard showing incorrect figures",
    date: "Jul 12, 2025",
    status: "Replied",
    preview:
      "My earnings dashboard is showing $200 less than expected for June...",
  },
  {
    from: "Emma Thompson",
    subject: "Feature request: recurring bookings",
    date: "Jul 11, 2025",
    status: "Read",
    preview:
      "It would be really useful to have the ability to set up recurring monthly bookings...",
  },
  {
    from: "Priya Sharma",
    subject: "Account verification delay",
    date: "Jul 10, 2025",
    status: "Replied",
    preview:
      "I submitted my ID verification 5 days ago and still haven't heard back...",
  },
  {
    from: "Anonymous User",
    subject: "Report: suspicious provider profile",
    date: "Jul 9, 2025",
    status: "New",
    preview:
      "I want to report a provider who seems to be posting fake reviews...",
  },
  {
    from: "Jessica Flores",
    subject: "Question about platform fees",
    date: "Jul 8, 2025",
    status: "Replied",
    preview:
      "Can you clarify how the 15% platform fee is calculated for bundle packages?",
  },
  {
    from: "Alex Nguyen",
    subject: "Mobile app not loading bookings",
    date: "Jul 7, 2025",
    status: "Read",
    preview:
      "Since the last update, my bookings tab on mobile shows a blank screen...",
  },
];

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
    Suspended: "bg-red-100 text-red-700 border-red-200",
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    New: "bg-blue-100 text-blue-700 border-blue-200",
    Read: "bg-gray-100 text-gray-600 border-gray-200",
    Replied: "bg-violet-100 text-violet-700 border-violet-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Sections ──────────────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-admin-heading mb-1">
          Platform Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Live snapshot of Pennywise performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {KPI_CARDS.map((kpi, i) => (
          <Card
            key={kpi.title}
            className="admin-kpi-card"
            data-ocid={`overview.card.${i + 1}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-admin-heading">
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl bg-muted/60 ${kpi.color}`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                {kpi.up ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}
                >
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="admin-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {ACTIVITY_FEED.map((item, i) => (
              <div
                key={`${item.user}-${item.time}`}
                className="flex items-start gap-3 px-6 py-3.5"
                data-ocid={`activity.item.${i + 1}`}
              >
                <div className="mt-0.5 w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagementSection() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = USERS_DATA.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || u.type === filter || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-admin-heading mb-1">
          User Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage all registered users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="users.search_input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Provider", "Taker", "Both", "Active", "Suspended"].map(
            (f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                data-ocid="users.filter.tab"
              >
                {f}
              </Button>
            ),
          )}
        </div>
      </div>

      <Card className="admin-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-ocid="users.table">
            {filtered.map((user, i) => (
              <TableRow key={user.email} data-ocid={`users.row.${i + 1}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {user.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.joined}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      data-ocid={`users.edit_button.${i + 1}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 px-2 ${user.status === "Suspended" ? "text-emerald-600 hover:text-emerald-700" : "text-red-500 hover:text-red-600"}`}
                      data-ocid={`users.delete_button.${i + 1}`}
                    >
                      {user.status === "Suspended" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Ban className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function IncomeLedgerSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-admin-heading mb-1">
          Income & Ledger
        </h2>
        <p className="text-sm text-muted-foreground">
          Financial records, categories, and vendor payouts
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="bg-muted/50" data-ocid="income.tab">
          <TabsTrigger value="categories" data-ocid="income.categories.tab">
            Income Categories
          </TabsTrigger>
          <TabsTrigger value="ledger" data-ocid="income.ledger.tab">
            General Ledger
          </TabsTrigger>
          <TabsTrigger value="vendor" data-ocid="income.vendor.tab">
            Vendor Income
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <Card className="admin-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-ocid="income.categories.table">
                {INCOME_CATEGORIES.map((cat, i) => (
                  <TableRow
                    key={cat.code}
                    data-ocid={`income.categories.row.${i + 1}`}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {cat.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {cat.description}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">
                      {cat.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <Card className="admin-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-ocid="income.ledger.table">
                {GL_ENTRIES.map((entry, i) => (
                  <TableRow
                    key={entry.ref}
                    data-ocid={`income.ledger.row.${i + 1}`}
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {entry.ref}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.description}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-emerald-700">
                      {entry.debit}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-red-600">
                      {entry.credit}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {entry.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="mt-4">
          <Card className="admin-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Vendor</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-ocid="income.vendor.table">
                {VENDOR_INCOME.map((v, i) => (
                  <TableRow
                    key={`${v.vendor}-${i}`}
                    data-ocid={`income.vendor.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(v.vendor)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{v.vendor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {v.service}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {v.amount}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {v.date}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JobListingsSection() {
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(JOB_LISTINGS.map((j, i) => [i, j.status])),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-admin-heading mb-1">
          Job Listings
        </h2>
        <p className="text-sm text-muted-foreground">
          All service listings on the platform
        </p>
      </div>

      <Card className="admin-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Title</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-ocid="jobs.table">
            {JOB_LISTINGS.map((job, i) => (
              <TableRow
                key={`${job.title}-${i}`}
                data-ocid={`jobs.row.${i + 1}`}
              >
                <TableCell className="font-medium text-sm max-w-[180px] truncate">
                  {job.title}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {job.provider}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {job.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {job.price}
                </TableCell>
                <TableCell>
                  <StatusBadge status={statuses[i]} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {job.created}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      data-ocid={`jobs.edit_button.${i + 1}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        setStatuses((prev) => ({
                          ...prev,
                          [i]: prev[i] === "Active" ? "Inactive" : "Active",
                        }))
                      }
                      data-ocid={`jobs.toggle.${i + 1}`}
                    >
                      {statuses[i] === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function CommunicationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-admin-heading mb-1">
          Client Communications
        </h2>
        <p className="text-sm text-muted-foreground">
          Incoming messages and support requests
        </p>
      </div>

      <Card className="admin-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-ocid="comms.table">
            {COMMUNICATIONS.map((msg, i) => (
              <TableRow
                key={`${msg.from}-${msg.date}`}
                data-ocid={`comms.row.${i + 1}`}
                className={msg.status === "New" ? "bg-blue-50/50" : ""}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(msg.from)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{msg.from}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm max-w-[200px] truncate">
                  {msg.subject}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {msg.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={msg.status} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">
                  {msg.preview}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs"
                    data-ocid={`comms.edit_button.${i + 1}`}
                  >
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SettingsSection() {
  const [platformFee, setPlatformFee] = useState("15");
  const [supportEmail, setSupportEmail] = useState("support@pennywise.app");
  const [maxBookings, setMaxBookings] = useState("50");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-admin-heading mb-1">
          Platform Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure global platform behavior
        </p>
      </div>

      <Card className="admin-card max-w-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="platform-fee" className="text-sm font-semibold">
              Platform Fee (%)
            </Label>
            <Input
              id="platform-fee"
              type="number"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              className="max-w-xs"
              data-ocid="settings.platform_fee.input"
            />
            <p className="text-xs text-muted-foreground">
              Commission taken from each completed booking
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email" className="text-sm font-semibold">
              Support Email
            </Label>
            <Input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="max-w-sm"
              data-ocid="settings.support_email.input"
            />
            <p className="text-xs text-muted-foreground">
              Users will see this address on contact forms
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-bookings" className="text-sm font-semibold">
              Max Bookings Per Day
            </Label>
            <Input
              id="max-bookings"
              type="number"
              value={maxBookings}
              onChange={(e) => setMaxBookings(e.target.value)}
              className="max-w-xs"
              data-ocid="settings.max_bookings.input"
            />
            <p className="text-xs text-muted-foreground">
              Hard cap per provider per calendar day
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div>
              <p className="font-semibold text-sm">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                Disables all new bookings platform-wide
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
              data-ocid="settings.maintenance.switch"
            />
          </div>

          {maintenanceMode && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-700 text-sm font-medium">
                ⚠️ Maintenance mode is active — bookings are disabled
              </span>
            </div>
          )}

          <Button className="w-full sm:w-auto" data-ocid="settings.save_button">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const sectionMap: Record<Section, React.ReactNode> = {
    overview: <OverviewSection />,
    users: <UserManagementSection />,
    income: <IncomeLedgerSection />,
    jobs: <JobListingsSection />,
    communications: <CommunicationsSection />,
    settings: <SettingsSection />,
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-admin-bg">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-admin-sidebar border-r border-admin-sidebar-border hidden md:flex flex-col">
        <div className="p-6 border-b border-admin-sidebar-border">
          <p className="text-xs font-bold uppercase tracking-widest text-admin-sidebar-muted">
            Admin Console
          </p>
          <p className="text-lg font-bold text-admin-sidebar-text mt-0.5">
            Pennywise
          </p>
        </div>
        <nav className="flex-1 py-4 px-3" data-ocid="admin.nav.panel">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              data-ocid={`admin.nav.${item.id}.link`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-admin-sidebar-text hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text"
              }`}
            >
              {item.icon}
              {item.label}
              {activeSection === item.id && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-admin-sidebar-border">
          <p className="text-xs text-admin-sidebar-muted">Logged in as Admin</p>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden w-full border-b bg-admin-sidebar">
        <div className="flex overflow-x-auto gap-1 p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-admin-sidebar-text hover:bg-admin-sidebar-hover"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {sectionMap[activeSection]}
        </div>
      </main>
    </div>
  );
}
