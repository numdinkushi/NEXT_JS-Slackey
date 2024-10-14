import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { AlertTriangle, ChevronDown, MailIcon, XIcon } from "lucide-react";
import Loading from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import useWorkspaceId from "@/hooks/use-workspace-id";

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}


const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
    workspaceId
  });
  const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId });
  console.log(12313, member);

  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember();

  if (isLoadingMember) {
    return <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-x-4 h-[49px] border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size='iconSm' variant='ghost'>
          <XIcon className="size-5 stroke-[1.51]" />
        </Button>
      </div>
      <Loading />
    </div>;
  }

  if (!member || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-x-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size='iconSm' variant='ghost'>
            <XIcon className="size-5 stroke-[1.51]" />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 h-full items-center justify-center' >
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>;
      </div>
    );
  }

  const avatarFallback = member.user.name?.[0] ?? 'K';

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-x-4 h-[49px] border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size='iconSm' variant='ghost'>
          <XIcon className="size-5 stroke-[1.51]" />
        </Button>
      </div>
      <div className='flex flex-col items-center justify-center p-4' >
        <Avatar className="max-h-[256px] max-w-[256px] size-full">
          <AvatarImage src={member.user.image} />
          <AvatarFallback className="aspect-square text-6xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">
          {member.user.name}
        </p>
        {
          currentMember?.role === 'admin' &&
            currentMember?._id === memberId ? (
            <Button variant='outline' className="w-full capitalize">
              {currentMember.role} <ChevronDown className="size-4 ml-2" />
            </Button>
          ) : null
        }
      </div>
      <Separator />
      <div className="flex flex-col p=4">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="tex-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link href={`mailto:${member.user.email}`}
              className="text0sm hover:underline text-[#1264a3]"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;