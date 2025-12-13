"use client"

import type React from "react"
import { adminLogout } from "@/app/actions/admin-auth" // Declare the adminLogout variable

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LogOut,
  AlertCircle,
  RefreshCw,
  Ticket,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  fetchTickets,
  fetchTechnicians,
  assignTechToTicket,
  type AdminTicket,
  type Technician,
} from "@/app/actions/admin-tickets"

type SortField = "created_at" | "priority" | "status" | "ticket_number"
type SortDirection = "asc" | "desc"

const priorityColors = {
  critical: "bg-red-500 text-white hover:bg-red-600",
  high: "bg-orange-500 text-white hover:bg-orange-600",
  medium: "bg-yellow-500 text-white hover:bg-yellow-600",
  low: "bg-green-500 text-white hover:bg-green-600",
}

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

export function TicketDashboard({
  userEmail,
  initialTickets,
}: {
  userEmail: string
  initialTickets: AdminTicket[]
}) {
  const [tickets, setTickets] = useState<AdminTicket[]>(initialTickets)
  const [filteredTickets, setFilteredTickets] = useState<AdminTicket[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [isPending, startTransition] = useTransition()
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const router = useRouter()

  useEffect(() => {
    calculateStats(tickets)
  }, [tickets])

  useEffect(() => {
    applyFiltersAndSort()
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter, sortField, sortDirection])

  useEffect(() => {
    loadTechnicians()
  }, [])

  const refreshTickets = async () => {
    startTransition(async () => {
      const { tickets: newTickets } = await fetchTickets()
      setTickets(newTickets)
    })
  }

  const loadTechnicians = async () => {
    const { technicians: fetchedTechs } = await fetchTechnicians()
    setTechnicians(fetchedTechs)
  }

  const calculateStats = (ticketData: AdminTicket[]) => {
    setStats({
      total: ticketData.length,
      open: ticketData.filter((t) => t.status === "open").length,
      inProgress: ticketData.filter((t) => t.status === "in-progress").length,
      resolved: ticketData.filter((t) => t.status === "resolved").length,
    })
  }

  const applyFiltersAndSort = () => {
    let filtered = [...tickets]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticket_number.toLowerCase().includes(query) ||
          ticket.email.toLowerCase().includes(query) ||
          ticket.name.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.company?.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter)
    }
    if (priorityFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter)
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.category === categoryFilter)
    }

    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "created_at") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortField === "priority") {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[aValue as keyof typeof priorityOrder]
        bValue = priorityOrder[bValue as keyof typeof priorityOrder]
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTickets(filtered)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    router.push("/admin/login")
    router.refresh()
  }

  const handleAssignTech = async (ticketId: string, techId: string | null, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening ticket details dialog

    startTransition(async () => {
      const { success, error } = await assignTechToTicket(ticketId, techId)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Technician assigned successfully",
        })
        await refreshTickets()
      }
    })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Ticket Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage and track support tickets</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">{userEmail}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshTickets}
              disabled={isPending}
              className="hover:bg-violet-50 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" onClick={handleLogout} className="hover:bg-violet-50 bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Tickets</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-white hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Open</CardTitle>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.open}</div>
              <p className="text-xs text-red-600/70 mt-1">Needs attention</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">In Progress</CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-blue-600/70 mt-1">Being worked on</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Resolved</CardTitle>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-green-600/70 mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100">
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("ticket_number")}
                        className="h-8 p-0 hover:bg-transparent font-semibold"
                      >
                        Ticket #
                        <SortIcon field="ticket_number" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Tech Assigned</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("priority")}
                        className="h-8 p-0 hover:bg-transparent font-semibold"
                      >
                        Priority
                        <SortIcon field="priority" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="h-8 p-0 hover:bg-transparent font-semibold"
                      >
                        Status
                        <SortIcon field="status" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("created_at")}
                        className="h-8 p-0 hover:bg-transparent font-semibold"
                      >
                        Created
                        <SortIcon field="created_at" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-violet-600" />
                        <p className="text-muted-foreground">Loading tickets...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Ticket className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-muted-foreground font-medium">No tickets found</p>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer hover:bg-violet-50/50 transition-colors"
                        onClick={() => window.open(`/admin/ticket/${ticket.id}`, "_blank")}
                      >
                        <TableCell className="font-mono text-sm font-medium text-violet-600">
                          {ticket.ticket_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.name}</div>
                            <div className="text-sm text-muted-foreground">{ticket.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate font-medium">{ticket.subject}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {ticket.category}
                          </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={ticket.tech_assigned_to || "unassigned"}
                            onValueChange={(value) =>
                              handleAssignTech(ticket.id, value === "unassigned" ? null : value, {} as React.MouseEvent)
                            }
                          >
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                              <SelectValue placeholder="Unassigned" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {technicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>
                                  {tech.full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${priorityColors[ticket.priority as keyof typeof priorityColors]} font-medium`}
                          >
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${statusColors[ticket.status as keyof typeof statusColors]} font-medium capitalize`}
                          >
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground font-medium">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
