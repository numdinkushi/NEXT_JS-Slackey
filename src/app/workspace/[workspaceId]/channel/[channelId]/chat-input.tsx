import React, { useRef } from 'react';
import dynamic from "next/dynamic";
import Quill from 'quill';

interface ChatInputProps {
    placeholder: string;
}

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const ChatInput = ({ placeholder }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null);

    return (
        <div className='px-5 w-full'>
            <Editor
                placeholder={placeholder}
                onSubmit={() => console.log('sfsf')}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    );
};

export default ChatInput;