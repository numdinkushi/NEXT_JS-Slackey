'use client';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import useChannelId from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Header from '../channel-header';
import ChatInput from './chat-input';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { MessageList } from '@/components/message-list';
import Loading from '@/components/loading';
import NotAvailable from '@/components/not-available';

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
    return <Loading />;
  }

  if (!channel) {
    return <NotAvailable message='Channel not found' />
  }

  return (
    <div className='flex flex-col pb-16'>
      <div className="">
        <Header title={channel.name} />
      </div>
      <div className='flex  flex-col h-[65vh] overflow-y-scroll '>
        <div className=" mb-28" >
          <MessageList
            channelName={channel.name}
            channelCreationTime={channel._creationTime}
            loadMore={loadMore}
            isLoadingMore={status === 'LoadingMore'}
            canLoadMore={status === 'CanLoadMore'}
            data={results}
            variant='channel'
          />
        </div>
      </div>
      <div className="flex-1 mt-40">
        <ChatInput placeholder={`Message # ${channel.name}`} />
      </div>
    </div>
  );
};

export default ChanelIdPage;