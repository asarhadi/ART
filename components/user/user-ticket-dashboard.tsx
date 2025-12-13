"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Ticket, Clock, CheckCircle2, RefreshCw, MessageSquare, Paperclip } from "lucide-react"
import { TicketDetailsDialog } from "@/components/user/ticket-details-dialog"
import { adminLogout } from "@/app/actions/admin-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UserTicketDashboardProps {
  tickets: any[]
  userEmail: string
  userId: string
}

export function UserTicketDashboard({ tickets, userEmail, userId }: UserTicketDashboardProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLogout = async () => {
    await adminLogout()
    router.push("/admin/login")
  }

  const handleRefresh = () => {
    router.refresh()
  }

  // Filter tickets based on search
  const filteredTickets = tickets.filter((ticket) => {
    const query = searchQuery.toLowerCase()
    return (
      ticket.ticket_number.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query) ||
      ticket.status.toLowerCase().includes(query)
    )
  })

  const openTickets = tickets.filter((t) => t.status === "Open").length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Waiting on Customer":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Resolved":
      case "Closed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <p className="text-gray-600 mt-1">View and manage your support tickets</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{tickets.length}</div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">{openTickets}</div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">{inProgressTickets}</div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">{resolvedTickets}</div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search tickets by number, subject, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>Click on a ticket to view details and add notes or attachments</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tickets found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setIsDialogOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-semibold text-violet-600">
                            {ticket.ticket_number}
                          </span>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600 mb-2">{ticket.description.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Category: {ticket.category}</span>
                          <span>•</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTicket && (
        <TicketDetailsDialog
          ticket={selectedTicket}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setSelectedTicket(null)
          }}
          userId={userId}
          userEmail={userEmail}
        />
      )}
    </div>
  )
}
