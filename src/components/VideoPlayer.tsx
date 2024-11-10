import React, { useEffect, useState, useRef } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const VideoPlayer: React.FC = () => {
    const [selectedEpisode, setSelectedEpisode] = useState<{ ep: string; server: string } | null>(null);
    const videoSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEpisodeSelected = (event: CustomEvent) => {
            setSelectedEpisode(event.detail);
            if (videoSectionRef.current) {
                setTimeout(() => {
                    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        };

        window.addEventListener('episodeSelected', handleEpisodeSelected as EventListener);

        return () => {
            window.removeEventListener('episodeSelected', handleEpisodeSelected as EventListener);
        };
    }, []);

    return (
        <div ref={videoSectionRef} className="container mx-auto px-36 mt-8">
            <AspectRatio ratio={16 / 9} className="border-2 border-gray-300 shadow-lg rounded-lg">
                {selectedEpisode && (
                    <iframe
                        src={selectedEpisode.server}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                    ></iframe>
                )}
            </AspectRatio>
        </div>
    );
};

export default VideoPlayer;