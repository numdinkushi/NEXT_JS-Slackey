import { TriangleAlert } from "lucide-react";

interface NotAvailableProps {
    message: string;
}

const NotAvailable = ({ message }: NotAvailableProps) => {
    return (
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
            <TriangleAlert className='size-6 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
                {message}
            </span>
        </div>
    );
};

export default NotAvailable;