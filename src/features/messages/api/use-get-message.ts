import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "@/lib/utils/convex";

interface UseGetMessageProps {
    id: Id<'messages'>;
}

export const useGetMessage = ({ id }: UseGetMessageProps) => {
    const data = useQuery(api.messages.getById, { id });
    const isLoading = data === undefined;

    return {
        data,
        isLoading
    };
};