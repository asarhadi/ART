"use client"

import { useState, useTransition, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateTicketStatus, fetchTicketReplies, addTicketReply, type TicketReply } from "@/app/actions/admin-tickets"
import { useToast } from "@/hooks/use-toast"
import { Paperclip, Send, Lock, Globe, Download } from "lucide-react"
import { Switch } from "@/components/ui/switch"

type Ticket = {
  id: string
  ticket_number: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string
  description: string
  category: string
  impact: string
  urgency: string
  priority: string
  status: string
  created_at: string
  updated_at: string
  attachments?: any[]
}

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

export function TicketDetailsDialog({
  ticket,
  open,
  onClose,
  onUpdate,
}: {
  ticket: Ticket
  open: boolean
  onClose: () => void
  onUpdate: () => void
}) {
  const [status, setStatus] = useState(ticket.status)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [replies, setReplies] = useState<TicketReply[]>([])
  const [replyText, setReplyText] = useState("")
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [isLoadingReplies, setIsLoadingReplies] = useState(false)

  useEffect(() => {
    if (open && ticket.id) {
      loadReplies()
    }
  }, [open, ticket.id])

  const loadReplies = async () => {
    setIsLoadingReplies(true)
    const { replies: fetchedReplies } = await fetchTicketReplies(ticket.id)
    setReplies(fetchedReplies)
    setIsLoadingReplies(false)
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
        onUpdate()
        onClose()
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
        onUpdate()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ticket Details
            <span className="font-mono text-sm text-muted-foreground">{ticket.ticket_number}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="replies">Replies & Notes ({replies.length})</TabsTrigger>
            <TabsTrigger value="attachments">Attachments ({ticket.attachments?.length || 0})</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="details" className="space-y-6 mt-0">
              {/* Status and Priority */}
              <div className="flex gap-4">
                <div className="flex-1">
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
                </div>
                <div className="flex-1">
                  <Label>Priority</Label>
                  <div className="mt-2">
                    <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{ticket.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{ticket.email}</span>
                  </div>
                  {ticket.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{ticket.phone}</span>
                    </div>
                  )}
                  {ticket.company && (
                    <div>
                      <span className="text-muted-foreground">Company:</span>{" "}
                      <span className="font-medium">{ticket.company}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Issue Details */}
              <div>
                <h3 className="font-semibold mb-3">Issue Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Subject</Label>
                    <p className="mt-1 font-medium">{ticket.subject}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{ticket.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="mt-1 capitalize">{ticket.category}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Impact</Label>
                      <p className="mt-1 capitalize">{ticket.impact}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Urgency</Label>
                      <p className="mt-1 capitalize">{ticket.urgency}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="mt-1">{new Date(ticket.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="mt-1">{new Date(ticket.updated_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus} disabled={isPending || status === ticket.status}>
                  {isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="replies" className="space-y-4 mt-0">
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
              <div className="space-y-3">
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
            </TabsContent>

            <TabsContent value="attachments" className="space-y-3 mt-0">
              {ticket.attachments && ticket.attachments.length > 0 ? (
                ticket.attachments.map((attachment: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
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
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No attachments</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
