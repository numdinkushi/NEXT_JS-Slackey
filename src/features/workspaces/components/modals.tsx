'use client';

import { useEffect, useState } from "react";
import CreateWorkspaceModal from "./create-workspace-modal";
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <CreateChannelModal />
            <CreateWorkspaceModal />
        </>
    );
};