import useMemberId from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import Loading from "@/components/loading";
import Header from "./header";
import ChatInput from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
    id: Id<'conversations'>;
}


const Conversation = ({ id }: ConversationProps) => {
    const memberId = useMemberId();

    const { data: member, memberLoading } = useGetMember({ id: memberId });
    const { results, status, loadMore } = useGetMessages({
        conversationId: id,
    });

    console.log(888, member);

    if (memberLoading || status === 'LoadingFirstPage') {
        return <Loading />;
    }

    return (
        <div className='flex flex-col pb-16'>
            <div className="">
            <Header
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => console.log('Header clicked')}
            />            </div>
            <div className='flex  flex-col h-[65vh] overflow-y-scroll '>
                <div className=" mb-28" >
                    <MessageList
                        memberName={member?.user?.name}
                        // channelCreationTime={channel._creationTime}
                        loadMore={loadMore}
                        isLoadingMore={status === 'LoadingMore'}
                        canLoadMore={status === 'CanLoadMore'}
                        data={results}
                        variant='conversation'
                        memberImage={member?.user?.image}
                    />
                </div>
            </div>
            <div className="flex-1 mt-40">
                <ChatInput
                    placeholder={`Message ${member?.user.name}`}
                    conversationId={id}
                />
            </div>
        </div>
    );
};

export default Conversation;