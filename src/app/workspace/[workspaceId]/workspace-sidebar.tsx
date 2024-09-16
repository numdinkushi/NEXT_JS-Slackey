import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkSpace } from '@/features/workspaces/api/use-get-workspace';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import React from 'react';
import WorkspaceHeader from './workspace-header';
import SidebarItem from './sidebar-item';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { WorkspaceSection } from './worspace-section';
import { useToggle } from "react-use";
import { useGetMembers } from '@/features/members/api/use-get-members';
import UserItem from './use-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';

const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();
    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });
    const [_open, setOpen] = useCreateChannelModal();
    
    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col bg-[#5e2c5f] h-full  items-center justify-center">
                <Loader className='size-5 animate-spin text-white' />
            </div>
        );
    }

    if (!workspace || !member) {
        return (
            <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full  items-center justify-center">
                <AlertTriangle className='size-5  text-white' />
                <p className='text-white text-sm'>Workspace not found</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col bg-[#5e2c5f] h-full '>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
            <div className="flex flex-col px-2 mt-3 align-star">
                <SidebarItem
                    label='Threads'
                    icon={MessageSquareText}
                    id='threads'
                />
                <SidebarItem
                    label='Drafts & Sent'
                    icon={SendHorizonal}
                    id='drafts'
                />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New Channel"
                onNew={() => member.role === 'admin' && setOpen(true)}

            >
                {
                    channels?.map((item) => {
                        return <SidebarItem
                            key={item._id}
                            icon={HashIcon}
                            label={item.name}
                            id={item._id}
                        />;
                    })
                }
            </WorkspaceSection>
            <WorkspaceSection
                label="Direct Messages"
                hint="New Direct message"
                onNew={() => { }}

            >
                {members?.map((item) => {
                    return (
                        <UserItem
                            key={item._id}
                            id={item._id}
                            label={item.user.name}
                            image={item.user.image}
                        />
                    );
                })}
            </WorkspaceSection>
        </div >
    );
};

export default WorkspaceSidebar; 