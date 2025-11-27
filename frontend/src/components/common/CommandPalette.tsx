'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Book,
  Search,
  Mic,
  Bot,
  Shuffle,
  Settings,
  FileText,
  Wrench,
  MessageCircleQuestion,
  Plus,
} from 'lucide-react'

const navigationItems = [
  { name: 'Sources', href: '/sources', icon: FileText, keywords: ['files', 'documents', 'upload'] },
  { name: 'Notebooks', href: '/notebooks', icon: Book, keywords: ['notes', 'research', 'projects'] },
  { name: 'Ask and Search', href: '/search', icon: Search, keywords: ['find', 'query'] },
  { name: 'Podcasts', href: '/podcasts', icon: Mic, keywords: ['audio', 'episodes', 'generate'] },
  { name: 'Models', href: '/models', icon: Bot, keywords: ['ai', 'llm', 'providers', 'openai', 'anthropic'] },
  { name: 'Transformations', href: '/transformations', icon: Shuffle, keywords: ['prompts', 'templates', 'actions'] },
  { name: 'Settings', href: '/settings', icon: Settings, keywords: ['preferences', 'config', 'options'] },
  { name: 'Advanced', href: '/advanced', icon: Wrench, keywords: ['debug', 'system', 'tools'] },
]

const createItems = [
  { name: 'Create Source', action: 'source', icon: FileText },
  { name: 'Create Notebook', action: 'notebook', icon: Book },
  { name: 'Create Podcast', action: 'podcast', icon: Mic },
]

interface CommandPaletteProps {
  onCreateSource?: () => void
  onCreateNotebook?: () => void
  onCreatePodcast?: () => void
}

export function CommandPalette({
  onCreateSource,
  onCreateNotebook,
  onCreatePodcast,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  // Global keyboard listener for ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false)
    setQuery('')
    callback()
  }, [])

  const handleNavigate = useCallback((href: string) => {
    handleSelect(() => router.push(href))
  }, [handleSelect, router])

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    handleSelect(() => router.push(`/search?q=${encodeURIComponent(query)}&mode=search`))
  }, [handleSelect, router, query])

  const handleAsk = useCallback(() => {
    if (!query.trim()) return
    handleSelect(() => router.push(`/search?q=${encodeURIComponent(query)}&mode=ask`))
  }, [handleSelect, router, query])

  const handleCreate = useCallback((action: string) => {
    handleSelect(() => {
      if (action === 'source' && onCreateSource) onCreateSource()
      else if (action === 'notebook' && onCreateNotebook) onCreateNotebook()
      else if (action === 'podcast' && onCreatePodcast) onCreatePodcast()
    })
  }, [handleSelect, onCreateSource, onCreateNotebook, onCreatePodcast])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Navigate, search, or ask your knowledge base"
    >
      <CommandInput
        placeholder="Type a command or search..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="text-sm text-muted-foreground">
            No commands found. Try searching or asking below.
          </div>
        </CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.name} ${item.keywords.join(' ')}`}
              onSelect={() => handleNavigate(item.href)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Create */}
        <CommandGroup heading="Create">
          {createItems.map((item) => (
            <CommandItem
              key={item.action}
              value={`create ${item.name}`}
              onSelect={() => handleCreate(item.action)}
            >
              <Plus className="h-4 w-4" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Search/Ask - always show when there's a query */}
        {query.trim() && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Search & Ask">
              <CommandItem
                value={`search ${query}`}
                onSelect={handleSearch}
              >
                <Search className="h-4 w-4" />
                <span>Search for &ldquo;{query}&rdquo;</span>
              </CommandItem>
              <CommandItem
                value={`ask ${query}`}
                onSelect={handleAsk}
              >
                <MessageCircleQuestion className="h-4 w-4" />
                <span>Ask about &ldquo;{query}&rdquo;</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
