/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import Error from "next/error";

type RequestType = {
    workspaceId: Id<'workspaces'>;
    memberId?: Id<'members'>;
};
type ResponseType = Doc<'conversations'> | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
};

export const useCreateOrGetConversations = () => {
    const [data, setData] = useState<ResponseType>(null);
    const [status, setStatus] = useState<'success' | 'error' | 'settled' | 'pending' | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const isPending = useMemo(() => status === 'pending', [status]);
    const isSuccess = useMemo(() => status === 'success', [status]);
    const isError = useMemo(() => status === 'error', [status]);
    const isSettled = useMemo(() => status === 'settled', [status]);

    const mutation = useMutation(api.conversations.createOrGet);

    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null);
            setError(null);
            setStatus('pending');
    
            if (!values.memberId) {
              return 
            }
    
            const response = await mutation({
                workspaceId: values.workspaceId,
                memberId: values.memberId,
            });
    
            setData(response);
            setStatus('success');
            options?.onSuccess?.(response);
    
            return response;
        } catch (error) {
            setStatus('error');
            setError(error as Error);
            options?.onError?.(error as Error);
    
            if (options?.throwError) {
                throw error;
            }
        } finally {
            setStatus('settled');
            options?.onSettled?.();
        }
    }, [mutation]);
    

    return {
        mutate,
        data,
        error,
        isPending,
        isSuccess,
        isError,
        isSettled
    };
};