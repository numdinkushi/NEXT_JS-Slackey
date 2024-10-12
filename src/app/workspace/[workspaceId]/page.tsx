'use client';
import Loading from '@/components/loading';
import NotAvailable from '@/components/not-available';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkSpace } from '@/features/workspaces/api/use-get-workspace';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

const WorkspaceIdPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({ id: workspaceId });
    const [open, setOpen] = useCreateChannelModal();
    const { data: channels, isLoading: channelsLoading } = useGetChannels({
        workspaceId
    });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }

    }, [
        channelId,
        member,
        memberLoading,
        isAdmin,
        workspaceLoading,
        workspace,
        channelsLoading,
        workspaceId,
        open,
        router,
        setOpen
    ]);

    if (workspaceLoading || channelsLoading || memberLoading) {
        return <Loading />;
    }

    if (!workspace || !member) {
        return  <NotAvailable message='Workspace not found' />
    }

    return (
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
            <TriangleAlert className='size-6  text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
                No  channel found
            </span>
        </div>
    );
};

export default WorkspaceIdPage;