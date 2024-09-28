import React, { useRef, useState } from 'react';
import dynamic from "next/dynamic";
import Quill from 'quill';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useChannelId from '@/hooks/use-channel-id';
import { toast } from 'sonner';

interface ChatInputProps {
    placeholder: string;
}

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const ChatInput = ({ placeholder }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);
    const editorRef = useRef<Quill | null>(null);
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();
    const { mutate: createMessage } = useCreateMessage();

    const handleSubmit = async ({
        body,
        image
    }: { body: string, image: File | null; }) => {

        try {
            setIsPending(true);
            await createMessage({
                workspaceId,
                channelId,
                body,
            }, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className='px-5 w-full'>
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    );
};

export default ChatInput;