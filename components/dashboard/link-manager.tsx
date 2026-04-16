'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, GripVertical, Pencil, Trash2, ExternalLink, BarChart2 } from 'lucide-react'
import type { Link } from '@/lib/types'

interface LinkManagerProps {
  initialLinks: Link[]
  userId: string
}

export function LinkManager({ initialLinks, userId }: LinkManagerProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddLink = async () => {
    if (!newTitle || !newUrl) return
    setIsLoading(true)

    const supabase = createClient()
    const position = links.length > 0 ? Math.max(...links.map(l => l.position)) + 1 : 0

    let url = newUrl
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        user_id: userId,
        title: newTitle,
        url: url,
        position: position,
        is_active: true,
      })
      .select()
      .single()

    if (!error && data) {
      setLinks([...links, data])
      setNewTitle('')
      setNewUrl('')
      setIsAddOpen(false)
    }

    setIsLoading(false)
  }

  const handleUpdateLink = async () => {
    if (!editingLink || !newTitle || !newUrl) return
    setIsLoading(true)

    const supabase = createClient()
    let url = newUrl
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const { error } = await supabase
      .from('links')
      .update({ title: newTitle, url: url })
      .eq('id', editingLink.id)

    if (!error) {
      setLinks(links.map(l => 
        l.id === editingLink.id ? { ...l, title: newTitle, url: url } : l
      ))
      setEditingLink(null)
      setNewTitle('')
      setNewUrl('')
    }

    setIsLoading(false)
  }

  const handleDeleteLink = async (linkId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (!error) {
      setLinks(links.filter(l => l.id !== linkId))
    }
  }

  const handleToggleActive = async (linkId: string, isActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('links')
      .update({ is_active: isActive })
      .eq('id', linkId)

    if (!error) {
      setLinks(links.map(l => 
        l.id === linkId ? { ...l, is_active: isActive } : l
      ))
    }
  }

  const openEditDialog = (link: Link) => {
    setEditingLink(link)
    setNewTitle(link.title)
    setNewUrl(link.url)
  }

  return (
    <div className="space-y-4">
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add New Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>Add a new link to your page</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My Website"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLink} disabled={isLoading || !newTitle || !newUrl}>
              {isLoading ? 'Adding...' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Update your link details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="My Website"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLink(null)}>Cancel</Button>
            <Button onClick={handleUpdateLink} disabled={isLoading || !newTitle || !newUrl}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {links.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No links yet</h3>
              <p className="mt-1 text-sm text-slate-500">Add your first link to get started</p>
            </CardContent>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id} className={`transition-opacity ${!link.is_active ? 'opacity-50' : ''}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="cursor-move text-slate-400">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">{link.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    <BarChart2 className="h-3 w-3" />
                    {link.clicks}
                  </div>
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={(checked) => handleToggleActive(link.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(link)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
