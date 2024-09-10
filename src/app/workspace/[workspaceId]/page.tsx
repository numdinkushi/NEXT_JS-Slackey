import React from 'react';

interface workSpaceIdProps {
    params: {
        workspaceId: string;
    };
}

const WorkspaceIdPage = ({ params }: workSpaceIdProps) => {
    return (
        <div>Id: {params.workspaceId}</div>
    );
};

export default WorkspaceIdPage;