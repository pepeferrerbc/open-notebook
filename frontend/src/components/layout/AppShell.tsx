'use client'

import { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { CommandPalette } from '@/components/common/CommandPalette'
import { AddSourceDialog } from '@/components/sources/AddSourceDialog'
import { CreateNotebookDialog } from '@/components/notebooks/CreateNotebookDialog'
import { GeneratePodcastDialog } from '@/components/podcasts/GeneratePodcastDialog'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  // Lifted dialog state for both sidebar and command palette
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false)
  const [notebookDialogOpen, setNotebookDialogOpen] = useState(false)
  const [podcastDialogOpen, setPodcastDialogOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        onCreateSource={() => setSourceDialogOpen(true)}
        onCreateNotebook={() => setNotebookDialogOpen(true)}
        onCreatePodcast={() => setPodcastDialogOpen(true)}
      />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </main>

      {/* Command Palette - accessible via ⌘K */}
      <CommandPalette
        onCreateSource={() => setSourceDialogOpen(true)}
        onCreateNotebook={() => setNotebookDialogOpen(true)}
        onCreatePodcast={() => setPodcastDialogOpen(true)}
      />

      {/* Create Dialogs */}
      <AddSourceDialog open={sourceDialogOpen} onOpenChange={setSourceDialogOpen} />
      <CreateNotebookDialog open={notebookDialogOpen} onOpenChange={setNotebookDialogOpen} />
      <GeneratePodcastDialog open={podcastDialogOpen} onOpenChange={setPodcastDialogOpen} />
    </div>
  )
}
