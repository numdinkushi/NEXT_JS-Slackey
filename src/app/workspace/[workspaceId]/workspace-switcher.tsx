import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetWorkSpace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkSpaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workSpaceId = useWorkspaceId();
    const { data: workspaces, isLoading: workSpacesLoading } = useGetWorkSpaces();
    const { data: workspace, isLoading: workSpaceLoading } = useGetWorkSpace({ id: workSpaceId });
    const [_open, setOpen] = useCreateWorkspaceModal();

    const filteredWorkspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workSpaceId
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='size-9 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl' >
                    {
                        workSpaceLoading
                            ? (
                                <Loader className='size-5 animate-spin' />
                            )
                            : (
                                workspace?.name?.charAt(0).toUpperCase()
                            )
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom' align='start' className='w-64'>
                <DropdownMenuItem onClick={() => router.push(`/workspace/${workSpaceId}`)} className='cursor-pointer flex flex-col justify-start items-start capitalize'>
                    {workspace?.name}
                    <span className='text-xs text-muted-foreground'>Active Workspace</span>
                </DropdownMenuItem>
                {
                    filteredWorkspaces?.map((workspace) => (
                        <DropdownMenuItem
                            key={workspace._id}
                            onClick={() => router.push(`/workspace/${workspace._id}`)}
                        className='cursor-pointer overflow-hidden capitalize'
                        >
                            <div className="shrin-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md  flex items-center justify-center mr-2">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                                {workspace.name}
                            </div>
                        </DropdownMenuItem>
                    ))
                }
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <div className="size-9 relative overflow-hidden bg-[#f2f3f2] text-slate-800 font-semibold text-lg rounded-md  flex items-center justify-center mr-2">
                        <Plus />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default WorkspaceSwitcher;