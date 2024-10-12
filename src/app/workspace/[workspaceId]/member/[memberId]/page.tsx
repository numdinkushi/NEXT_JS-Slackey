'use client';
import { useCreateOrGetConversations } from '@/features/conversations/api/use-create-or-get-conversation';
import useMemberId from '@/hooks/use-member-id';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { AlertTriangle, Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import Conversation from './conversation';

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();
    const { data, mutate, isPending } = useCreateOrGetConversations();

    useEffect(() => {
        mutate({
            workspaceId,
            memberId
        });
    }, [workspaceId, memberId, mutate]);

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className='size-6 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-full flex  flex-col gap-y-2 items-center justify-center">
                <AlertTriangle className='size-6 animate-spin text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                    Conversation not found
                </span>
            </div>
        );
    }

    return <Conversation
        id={data?._id}
    />;
};

export default MemberIdPage;