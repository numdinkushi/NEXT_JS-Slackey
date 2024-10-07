'use client';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import useChannelId from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Header from '../channel-header';
import ChatInput from './chat-input';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { MessageList } from '@/components/message-list';

const ChanelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: chanelLoading } = useGetChannel({ id: channelId });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }
  
  if (chanelLoading || status === 'LoadingFirstPage') {
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
    <>
      <div className='flex relative flex-col h-full overflow-y-scroll '>
        <Header title={channel.name} />
        <div className="flex-1 " >
          <MessageList
            channelName={channel.name}
            channelCreationTime={channel._creationTime}
            loadMore={loadMore}
            isLoadingMore={status === 'LoadingMore'}
            canLoadMore={status === 'CanLoadMore'}
            data={results}
          />
        </div>
        <div className="bottom-0 w-full max-h-32 fixed">
          <ChatInput placeholder={`Message # ${channel.name}`} />
        </div>
      </div>
    </>
  );
};

export default ChanelIdPage;