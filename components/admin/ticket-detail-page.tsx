"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  updateTicketStatus,
  fetchTicketReplies,
  addTicketReply,
  fetchTechnicians,
  assignTechToTicket,
  type AdminTicket,
  type TicketReply,
  type Technician,
} from "@/app/actions/admin-tickets"
import { useToast } from "@/hooks/use-toast"
import { Paperclip, Send, Lock, Globe, Download, ArrowLeft, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

const priorityColors = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-green-500 text-white",
}

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

export function TicketDetailPage({ ticket: initialTicket }: { ticket: AdminTicket }) {
  const [ticket, setTicket] = useState(initialTicket)
  const [status, setStatus] = useState(ticket.status)
  const [techAssigned, setTechAssigned] = useState(ticket.tech_assigned_to || "unassigned")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const [replies, setReplies] = useState<TicketReply[]>([])
  const [replyText, setReplyText] = useState("")
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [isLoadingReplies, setIsLoadingReplies] = useState(false)
  const [technicians, setTechnicians] = useState<Technician[]>([])

  useEffect(() => {
    loadReplies()
    loadTechnicians()
  }, [])

  const loadReplies = async () => {
    setIsLoadingReplies(true)
    const { replies: fetchedReplies } = await fetchTicketReplies(ticket.id)
    setReplies(fetchedReplies)
    setIsLoadingReplies(false)
  }

  const loadTechnicians = async () => {
    const { technicians: fetchedTechs } = await fetchTechnicians()
    setTechnicians(fetchedTechs)
  }

  const handleUpdateStatus = async () => {
    startTransition(async () => {
      const { success, error } = await updateTicketStatus(ticket.id, status)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Ticket status updated successfully",
        })
        setTicket({ ...ticket, status })
      }
    })
  }

  const handleAssignTech = async (techId: string) => {
    startTransition(async () => {
      const { success, error } = await assignTechToTicket(ticket.id, techId === "unassigned" ? null : techId)

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
        setTicket({ ...ticket, tech_assigned_to: techId === "unassigned" ? null : techId })
      }
    })
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      const { success, error } = await addTicketReply(ticket.id, replyText, isInternalNote)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: isInternalNote ? "Internal note added" : "Reply sent to customer",
        })
        setReplyText("")
        setIsInternalNote(false)
        await loadReplies()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="hover:bg-violet-50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Ticket Details
              </h1>
              <p className="text-muted-foreground mt-1 font-mono text-sm">{ticket.ticket_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>{ticket.priority}</Badge>
            <Badge
              variant="outline"
              className={`${statusColors[ticket.status as keyof typeof statusColors]} capitalize`}
            >
              {ticket.status}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Customer Information
                  </h3>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{ticket.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{ticket.email}</span>
                    </div>
                    {ticket.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{ticket.phone}</span>
                      </div>
                    )}
                    {ticket.company && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Company:</span>
                        <span className="font-medium">{ticket.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Issue Details */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Issue Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Subject</Label>
                      <p className="mt-1 font-medium">{ticket.subject}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Description</Label>
                      <p className="mt-1 whitespace-pre-wrap text-sm">{ticket.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground text-xs">Category</Label>
                        <p className="mt-1 capitalize">{ticket.category}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Impact</Label>
                        <p className="mt-1 capitalize">{ticket.impact}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Urgency</Label>
                        <p className="mt-1 capitalize">{ticket.urgency}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground text-xs">Created</Label>
                    <p className="mt-1">{new Date(ticket.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Last Updated</Label>
                    <p className="mt-1">{new Date(ticket.updated_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Attachments */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                        Attachments ({ticket.attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {ticket.attachments.map((attachment: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : "Unknown size"}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Replies Section */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Replies & Notes ({replies.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reply Form */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reply">Add Reply or Note</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="internal-note" className="text-sm font-normal cursor-pointer">
                        {isInternalNote ? (
                          <span className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Internal Note
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Customer Reply
                          </span>
                        )}
                      </Label>
                      <Switch id="internal-note" checked={isInternalNote} onCheckedChange={setIsInternalNote} />
                    </div>
                  </div>
                  <Textarea
                    id="reply"
                    placeholder={isInternalNote ? "Add an internal note..." : "Type your reply to the customer..."}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendReply} disabled={isPending || !replyText.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      {isPending ? "Sending..." : isInternalNote ? "Add Note" : "Send Reply"}
                    </Button>
                  </div>
                </div>

                {/* Replies List */}
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {isLoadingReplies ? (
                      <p className="text-center text-muted-foreground py-8">Loading replies...</p>
                    ) : replies.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No replies or notes yet</p>
                    ) : (
                      replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-lg border ${
                            reply.is_internal ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">{reply.author_name}</p>
                              <p className="text-xs text-muted-foreground">{reply.author_email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {reply.is_internal && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Internal
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap mt-2">{reply.reply_text}</p>
                          {reply.attachments && reply.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {reply.attachments.map((attachment: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="gap-1">
                                  <Paperclip className="h-3 w-3" />
                                  {attachment.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={isPending || status === ticket.status}
                    className="w-full mt-2"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "Updating..." : "Update Status"}
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label>Assign Technician</Label>
                  <Select value={techAssigned} onValueChange={handleAssignTech}>
                    <SelectTrigger className="mt-2">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
