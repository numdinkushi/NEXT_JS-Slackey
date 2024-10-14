import { api } from "@/lib/utils/convex";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMemberProps {
    id: Id<"members">;
}

interface MemberData {
    user: {
        _id: Id<"users">;
        _creationTime: number;
        name?: string;
        image?: string;
        email?: string;
        emailVerificationTime?: number;
        phone?: string;
        phoneVerificationTime?: number;
        isAnonymous?: boolean;
        role?: 'member' | 'admin';
    };
}

export const useGetMember = ({ id }: UseGetMemberProps) => {
    const data = useQuery(api.members.getById, { id });
    const isLoading = data === undefined;

    if (Array.isArray(data) && data.length === 0) {
        return {
            data: null,
            isLoading,
        };
    }

    return {
        data: data as MemberData,
        isLoading,
    };
};
