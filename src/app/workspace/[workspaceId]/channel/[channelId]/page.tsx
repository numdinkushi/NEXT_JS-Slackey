'use client';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import useChannelId from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import React from 'react';
import Header from '../channel-header';

const ChanelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: chanelLoading } = useGetChannel({ id: channelId });

  if (chanelLoading) {
    return <div className='h-full flex-1 flex items-center justify-center '>
      <Loader className='animate-spin size-5 text-muted-foreground' />
    </div>;
  }

  if (!channel) {
    return <div className='h-full flex-1 flex flex-col gap-y-4 items-center justify-center '>
      <TriangleAlert className='size-6 text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>Channel not found</span>
    </div>;
  }

  return (
    <div className='flex flex-col h-full'>
      <Header title={channel.name} />
    </div>
  );
};

export default ChanelIdPage;