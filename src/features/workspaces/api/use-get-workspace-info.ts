import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkSpaceProps {
    id: Id<"workspaces">;
}

export const useGetWorkSpaceInfo = ({ id }: UseGetWorkSpaceProps) => {
    const data = useQuery(api.workspaces.getInfoById, { id });
    const isLoading = data === undefined;
    // const isLoading = false;

    return { data, isLoading };
};