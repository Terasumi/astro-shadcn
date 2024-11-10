import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Episode = {
    server_name: string;
    server_data: {
        slug: string;
        name: string;
        link_embed: string;
    }[];
};

type EpisodeSelectorProps = {
    episodes: Episode[];
};

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ episodes }) => {
    const [selectedServer, setSelectedServer] = useState(episodes[0]?.server_name || '');
    const [selectedEpisode, setSelectedEpisode] = useState<{ ep: string; server: string } | null>(null);

    const handleEpisodeSelect = (ep: string, server: string) => {
        setSelectedEpisode({ ep, server });
        // You might want to emit an event or use a state management solution to communicate with VideoPlayer
        window.dispatchEvent(new CustomEvent('episodeSelected', { detail: { ep, server } }));
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Các tập</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={episodes[0].server_name} onValueChange={setSelectedServer}>
                    <TabsList className="grid grid-cols-2 lg:grid-cols-4">
                        {episodes.map(episode => (
                            <TabsTrigger key={episode.server_name} value={episode.server_name}>
                                {episode.server_name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {episodes.map(episode => (
                        <TabsContent key={episode.server_name} value={episode.server_name}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {episode.server_data.map(serverData => (
                                    <Button
                                        key={serverData.slug}
                                        variant={selectedEpisode?.ep === serverData.slug ? 'destructive' : 'outline'}
                                        onClick={() => handleEpisodeSelect(serverData.slug, serverData.link_embed)}
                                        className="w-full"
                                    >
                                        {serverData.name}
                                    </Button>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default EpisodeSelector;