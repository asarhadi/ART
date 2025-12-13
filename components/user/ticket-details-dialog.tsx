"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { addTicketNote } from "@/app/actions/ticket-actions"
import { Loader2, MessageSquare, Paperclip, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface TicketDetailsDialogProps {
  ticket: any
  isOpen: boolean
  onClose: () => void
  userId: string
  userEmail: string
}

export function TicketDetailsDialog({ ticket, isOpen, onClose, userId, userEmail }: TicketDetailsDialogProps) {
  const router = useRouter()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddNote = async () => {
    if (!note.trim()) return

    setLoading(true)
    const result = await addTicketNote(ticket.id, note, userId, userEmail)

    if (result.success) {
      setNote("")
      router.refresh()
    }

    setLoading(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
      case "Closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Ticket Details</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Header */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-semibold text-violet-600">{ticket.ticket_number}</span>
            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
            <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
          </div>

          {/* Ticket Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Subject</Label>
              <p className="font-semibold">{ticket.subject}</p>
            </div>
            <div>
              <Label className="text-gray-600">Category</Label>
              <p className="font-semibold">{ticket.category}</p>
            </div>
            <div>
              <Label className="text-gray-600">Created</Label>
              <p className="font-semibold">{new Date(ticket.created_at).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-gray-600">SLA Response Time</Label>
              <p className="font-semibold">{ticket.sla_response_time}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-gray-600">Description</Label>
            <p className="mt-2 p-4 bg-gray-50 rounded-lg">{ticket.description}</p>
          </div>

          {/* Add Note Section */}
          <div className="border-t pt-6">
            <Label className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4" />
              Add Note
            </Label>
            <Textarea
              placeholder="Add a note to this ticket..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="mb-3"
            />
            <Button onClick={handleAddNote} disabled={loading || !note.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Note
            </Button>
          </div>

          {/* Add Attachment Section */}
          <div className="border-t pt-6">
            <Label className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4" />
              Add Attachment
            </Label>
            <Input type="file" className="mb-3" />
            <Button variant="outline">Upload Attachment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
