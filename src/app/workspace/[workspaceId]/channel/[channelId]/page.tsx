'use client';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import useChannelId from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import React from 'react';
import Header from '../channel-header';
import ChatInput from './chat-input';
import { useGetMessages } from '@/features/messages/api/use-get-messages';

const ChanelIdPage = () => {
  const channelId = useChannelId();

  const { results } = useGetMessages({ channelId });
  const { data: channel, isLoading: chanelLoading } = useGetChannel({ id: channelId });

  if (chanelLoading) {
    return <div className='h-full flex-1 flex items-center justify-center '>
      <Loader className='animate-spin size-5 text-muted-foreground' />
    </div>;
  }

  console.log(123, results);

  if (!channel) {
    return <div className='h-full flex-1 flex flex-col gap-y-4 items-center justify-center '>
      <TriangleAlert className='size-6 text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>Channel not found</span>
    </div>;
  }

  return (
    <div className='flex flex-col h-full'>
      <Header title={channel.name} />
      <div className="flex-1" >
        {JSON.stringify(results)}
      </div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChanelIdPage;