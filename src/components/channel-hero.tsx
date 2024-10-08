import { format } from "date-fns";

interface ChannelHeroProps {
    name: string;
    creationTime: number;
}

const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
    return (
        <div className="mt-[88px] mb-4">
            <p className="text-2xl font-bold flex items-center mb-2">
                # {name}
            </p>
            <p className="font-normal text-slate-800 mb-4">
                This channel was created on {format(creationTime, 'MMM do, yyy')}. This is the very beginning of the <strong>{name}</strong> Channel.
            </p>
        </div>
    );
};

export default ChannelHero;
