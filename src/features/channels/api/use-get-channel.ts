import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "@/lib/utils/convex";

interface UseGetChannelProps {
    id: Id<'channels'>;
}

export const useGetChannel = ({ id }: UseGetChannelProps) => {
    const data = useQuery(api.channels.getById, { id });
    const isLoading = data === undefined;

    return {
        data,
        isLoading
    };
};