import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { Button } from './ui/button';
import { PiTextAa } from 'react-icons/pi';
import { ImageIcon, Smile } from 'lucide-react';
import { MdSend } from "react-icons/md";
import Hint from './hint';
import { Delta, Op } from "quill/core";
import { cn } from '@/lib/utils';
import EmojiPopover from './emoji-popover';

type EditorValue = {
    image: File | null;
    body: string;
};

interface EditorProps {
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    onSubmit: ({ image, body }: EditorValue) => void;
    variant?: 'create' | 'update';
}

const Editor = ({
    variant = 'create',
    // onCancel,
    placeholder = 'Write something...',
    defaultValue = [],
    disabled = false,
    innerRef,
    onSubmit
}: EditorProps) => {
    const [text, setText] = useState('');
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ['bold', 'italic', 'strike'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }]
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: 'Enter',
                            handler: () => {
                                // TODO: submit form
                                return;
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, '\n');
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current?.focus();

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        if (innerRef) {
            innerRef.current = quill;
        }

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    const toggleToolbar = () => {
        setIsToolbarVisible((current) => !current);
        const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

        if (toolbarElement) {
            toolbarElement.classList.toggle('hidden');
        }
    };

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
    };

    return (
        <div className='flex flex-col'>
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div className="h-full ql-custom" ref={containerRef} />
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolbarVisible ? 'Hide formatting' : 'show formatting'}>
                        <Button disabled={disabled}
                            size='iconSm'
                            variant='ghost'
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className='size-4' />
                        </Button>
                    </Hint>
                    <Hint label='emoji'>
                        <Button disabled={disabled}
                            size='iconSm'
                            variant='ghost'
                        >
                            <EmojiPopover onEmojiSelect={onEmojiSelect}>
                                <Smile className='size-4' />
                            </EmojiPopover>
                        </Button>
                    </Hint>
                    {
                        variant === 'create' && (
                            <Hint label='image'>
                                <Button
                                    disabled={disabled}
                                    size='iconSm'
                                    variant='ghost'
                                    onClick={() => { }}
                                >
                                    <ImageIcon className='size-4' />
                                </Button>
                            </Hint>
                        )
                    }
                    {
                        variant === 'update' && (
                            <div className="ml-auto flex items-center gap-x-2">

                                <Button
                                    disabled={disabled}
                                    size='sm'
                                    variant='outline'
                                    onClick={() => { }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={disabled || isEmpty}
                                    size='sm'
                                    variant='outline'
                                    onClick={() => { }}
                                    className=' bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                                >
                                    Save
                                </Button>
                            </div>

                        )
                    }
                    {
                        variant === 'create' && (
                            <Button
                                disabled={disabled || isEmpty}
                                onClick={() => { }}
                                className={cn('ml-auto', isEmpty
                                    ? 'bg-white hover:bg-white text-muted-foreground'
                                    : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white',
                                )} size='sm'>
                                <MdSend className='size-4' />
                            </Button>
                        )
                    }
                </div>
            </div>
            {
                variant === 'create' && (
                    <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                        !isEmpty && 'opacity-100')}>
                        <p>
                            <strong>Shift + Return</strong> to add a new line
                        </p>
                    </div>
                )
            }
        </div>
    );
};

export default Editor;