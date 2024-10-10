import React from 'react';
import { Button } from './ui/button';
import { MessageSquareTextIcon, Pencil, SmileIcon, Trash } from 'lucide-react';
import Hint from './hint';
import EmojiPopover from './emoji-popover';
interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    hideThreadButton?: boolean;
    handleReaction: (value: string) => void;
}

const Toolbar = (
    {
        isAuthor,
        isPending,
        handleEdit,
        handleThread,
        handleDelete,
        hideThreadButton,
        handleReaction
    }: ToolbarProps
) => {
    return (
        <div className='absolute top-0 right-5'>
            <div className="flex gap-2 group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                <EmojiPopover hint='Add reaction' onEmojiSelect={(emoji) => handleReaction(emoji.string)}>
                    <Button
                        variant='ghost'
                        size='iconSm'
                        className='size-4'
                        disabled={isPending}
                    >
                        <SmileIcon />
                    </Button>
                </EmojiPopover>
                {
                    !hideThreadButton && (
                        <Hint label='Reply in thread'>
                            <Button
                                variant='ghost'
                                size='iconSm'
                                className='size-4'
                                disabled={isPending}
                                onClick={handleThread}
                            >
                                <MessageSquareTextIcon />
                            </Button>
                        </Hint>
                    )
                }
                {
                    isAuthor && (
                        <Hint label='Edit Message'>
                            <Button
                                variant='ghost'
                                size='iconSm'
                                className='size-4'
                                disabled={isPending}
                                onClick={handleEdit}
                            >
                                <Pencil />
                            </Button>
                        </Hint>
                    )
                }
                {
                    isAuthor && (
                        <Hint label='Delete Message'>
                            <Button
                                variant='ghost'
                                size='iconSm'
                                className='size-4'
                                disabled={isPending}
                                onClick={handleDelete}
                            >
                                <Trash />
                            </Button>
                        </Hint>
                    )
                }
            </div>
        </div>
    );
};


export default Toolbar;