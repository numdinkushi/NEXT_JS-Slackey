'use client';
import React, { useEffect, useState } from 'react';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import WorkspaceSidebar from './workspace-sidebar';

const WorkspaceLayout = ({ children }: { children: React.ReactNode; }) => {
    const [mounted, setMounted] = useState(false);

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
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default WorkspaceLayout;