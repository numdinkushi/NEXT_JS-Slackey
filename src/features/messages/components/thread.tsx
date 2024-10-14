import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, ArrowUp, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import Message from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import useWorkspaceId from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import useMounted from "@/hooks/use-mounted";
import Quill from "quill";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { toast } from "sonner";
import useChannelId from "@/hooks/use-channel-id";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Loading from "@/components/loading";

const formatDateLabel = (dateStrL: string) => {
    const date = new Date(dateStrL);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';

    return format(date, 'EEEE, MMMM d');
};

const TIME_THRESHOLD = 5;

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

type CreateMessageValues = {
    channelId: Id<'channels'>;
    workspaceId: Id<'workspaces'>;
    parentMessageId: Id<'messages'>;
    body: string;
    image?: Id<'_storage'> | undefined;
};

interface ThreadProps {
    messageId: Id<'messages'>;
    onClose: () => void;
}


const Thread = ({ messageId, onClose }: ThreadProps) => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
    const { data: currentMember } = useCurrentMember({ workspaceId });
    const { results, status, loadMore } = useGetMessages({
        channelId,
        parentMessageId: messageId,
    });

    const canLoadMore = status === 'CanLoadMore';
    const isLoadingMore = status === 'LoadingMore';

    const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);

    const { mutate: createMessage } = useCreateMessage();
    const { mutate: generateUploadUrl } = useGenerateUploadUrl();

    const handleSubmit = async ({
        body,
        image
    }: { body: string, image: File | null; }) => {

        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                parentMessageId: messageId,
                body,
                image: undefined,
            };

            if (image) {
                const url = await generateUploadUrl({}, { throwError: true });
                console.log(8824, JSON.stringify(image));

                if (!url) {
                    throw new Error('Url not found');
                }

                const result = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': image.type,
                    },
                    body: image,
                });

                if (!result.ok) {
                    throw new Error('Failed to upload image');
                }

                const { storageId } = await result.json();
                values.image = storageId;
            }

            await createMessage(values, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsPending(false);
            editorRef?.current?.enable(true);
        }
    };

    useMounted();

    const groupedMessages = results?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].unshift(message);

            return groups;
        }, {} as Record<string, typeof results>
    );

    if (loadingMessage || status === 'LoadingFirstPage') {
        return <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-x-4 h-[49px] border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size='iconSm' variant='ghost'>
                    <XIcon className="size-5 stroke-[1.51]" />
                </Button>
            </div>
           <Loading />
        </div>;
    }

    if (!message) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-x-4 h-[49px] border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size='iconSm' variant='ghost'>
                        <XIcon className="size-5 stroke-[1.51]" />
                    </Button>
                </div>
                <div className='flex flex-col gap-y-2 h-full items-center justify-center' >
                    <AlertTriangle className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div>;
            </div>
        );
    }

    return (
        <div className='flex flex-col pb-16 '>
            <div className="flex justify-between items-center p-x-4 h-[49px] border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size='iconSm' variant='ghost'>
                    <XIcon className="size-5 stroke-[1.51]" />
                </Button>
            </div>
            <div className='flex  flex-col h-[65vh] overflow-y-scroll '>
                <div className=" mb-28 " >
                    <div className="flex-1 flex flex-col-reverse pb-4 messages-scrollbar">
                        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
                            <div className="" key={dateKey}>
                                <div className="text-center my-2 relative">
                                    <hr className="absolute top-1/2 left-0 border-t border-gray-300" />
                                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                        {formatDateLabel(dateKey)}
                                    </span>
                                </div>
                                {messages.map((message, index) => {
                                    const prevMessage = messages[index - 1];
                                    const isCompact = prevMessage
                                        && prevMessage.user?._id === message.user._id
                                        && differenceInMinutes(
                                            new Date(message._creationTime),
                                            new Date(prevMessage._creationTime)
                                        ) < TIME_THRESHOLD;

                                    return (
                                        <Message
                                            key={message._id}
                                            id={message._id}
                                            memberId={message.memberId}
                                            authorImage={message.user.image}
                                            authorName={message.user.name}
                                            isAuthor={message.memberId === currentMember?._id}
                                            reactions={message.reactions}
                                            body={message.body}
                                            image={message.image}
                                            isEditing={editingId === message._id}
                                            setEditingId={setEditingId}
                                            isCompact={isCompact}
                                            hideThreadButton
                                            updatedAt={message.updatedAt}
                                            createdAt={message._creationTime}
                                            threadCount={message.threadCount}
                                            threadImage={message.threadImage}
                                            threadName={message.threadName}
                                            threadTimestamp={message.threadTimestamp}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                        {!isLoadingMore && <div className="text-center">
                            <button onClick={loadMore}><ArrowUp /></button>
                        </div>}
                        {
                            isLoadingMore && <div className="text-center my-2 relative">
                                <hr className="absolute top-1/2 left-0 border-t border-gray-300" />
                                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                    <Loader className="size-4 animate-spin" />
                                </span>
                            </div>
                        }
                        {/* <div className="h-1" ref={(el) => {
                            if (el) {
                                const observer = new IntersectionObserver(
                                    ([entry]) => {
                                        if (entry.isIntersecting && canLoadMore) {
                                            loadMore();
                                        }
                                    },
                                    { threshold: 1.0 }
                                );

                                observer.observe(el);
                                observer.disconnect();
                            }
                        }} /> */}

                        <Message
                            hideThreadButton
                            memberId={message.memberId}
                            authorImage={message.user.image}
                            authorName={message.user.name}
                            isAuthor={message.memberId === currentMember?._id}
                            body={message.body}
                            image={message.image}
                            createdAt={message._creationTime}
                            updatedAt={message.updatedAt}
                            id={message._id}
                            reactions={message.reactions}
                            isEditing={editingId == message._id}
                            setEditingId={setEditingId}
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 mt-40">
                <Editor
                    onSubmit={handleSubmit}
                    innerRef={editorRef}
                    key={editorKey}
                    disabled={isPending}
                    placeholder="Reply..."
                />
            </div>
        </div>
    );
};

export default Thread;