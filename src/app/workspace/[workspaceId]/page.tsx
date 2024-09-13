'use client';
import { useGetWorkSpace } from '@/features/workspaces/api/use-get-workspace';
import useWorkspaceId from '@/hooks/use-workspace-id';
import React from 'react';

const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId();
    const { data } = useGetWorkSpace({ id: workspaceId });

    return (
        <div>Workspace id page</div>
    );
};

export default WorkspaceIdPage;