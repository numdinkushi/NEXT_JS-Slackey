'use client';
import React, { useEffect, useState } from 'react';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import WorkspaceSidebar from './workspace-sidebar';
import { usePanel } from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/thread';

const WorkspaceLayout = ({ children }: { children: React.ReactNode; }) => {
    const [mounted, setMounted] = useState(false);
    const { parentMessageId, onClose } = usePanel();
    const showPanel = !!parentMessageId;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className='h-full'>
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction='horizontal'
                    autoSaveId='kne-workspace-layout'
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className='bg-[#5e2c5f]'
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={20}>
                        {children}
                    </ResizablePanel>
                    {
                        showPanel && (
                            <>
                                <ResizableHandle withHandle />
                                <ResizablePanel defaultSize={29} minSize={20} >
                                    {
                                        parentMessageId ? (
                                            <Thread
                                                messageId={parentMessageId as Id<'messages'>}
                                                onClose={onClose}
                                            />
                                        ) : (
                                            <div className='flex h-full items-center justify-center' >
                                                <Loader className="size-5 animate-spin text-muted-foreground" />
                                            </div>
                                        )
                                    }
                                </ResizablePanel>
                            </>
                        )
                    }
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default WorkspaceLayout;