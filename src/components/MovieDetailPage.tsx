'use client'

import {useRef, useState} from 'react'
import { Star, Calendar, Clock, Eye, Film, Globe, User, Users, Video } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type {MovieResponseDetail} from "@/types";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";

type SelectedEpisode = {
    ep: string
    server: string
}

export default function MovieDetailPage({ data }: { data: MovieResponseDetail }) {
    const movie = data.movie
    const episodes = data.episodes

    const [selectedServer, setSelectedServer] = useState(episodes[0]?.server_name || '')
    const [selectedEpisode, setSelectedEpisode] = useState<SelectedEpisode|null>(null)
    const videoSectionRef = useRef(null)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-0">
                            <img
                                src={movie.poster_url}
                                alt={movie.name}
                                width={500}
                                height={750}
                                className="w-full h-auto rounded-t-lg"
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">{movie.name}</CardTitle>
                            <CardDescription><span className="font-semibold">Tên gốc:</span> {movie.origin_name}</CardDescription>                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>{movie.year}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{movie.time}</span>
                                </div>
                                <div className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>{movie.view} Lượt view</span>
                                </div>
                                <div className="flex items-center">
                                    <Film className="mr-2 h-4 w-4" />
                                    <span>{movie.episode_current}/{movie.episode_total} tập</span>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <p><strong>Trạng thái:</strong> {movie.status}</p>
                                <p><strong>Tóm tắt nội dung:</strong> {movie.content}</p>
                                <div className="flex flex-wrap gap-2">
                                    <strong className="w-full">Thể loại:</strong>
                                    {movie.category.map(cat => (
                                        <Badge key={cat.id} variant="outline">{cat.name}</Badge>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <strong className="w-full">Quốc gia:</strong>
                                    {movie.country.map(country => (
                                        <Badge key={country.id} variant="outline">{country.name}</Badge>
                                    ))}
                                </div>
                                <p><strong>Đạo diễn:</strong> {movie.director.join(', ')}</p>
                                <p><strong>Diễn viên:</strong> {movie.actor.join(', ')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {episodes.length > 0 && (
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
                                                    <Button key={serverData.slug} variant={
                                                        selectedEpisode?.ep === serverData.slug ? 'destructive' : 'outline'
                                                    }
                                                            onClick={() => {
                                                                setSelectedEpisode({
                                                                    ep: serverData.slug,
                                                                    server: serverData.link_embed
                                                                })
                                                                if (videoSectionRef.current) {
                                                                    setTimeout(() => {
                                                                        // @ts-ignore
                                                                        videoSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
                                                                    }, 100) // Small delay to ensure the video has rendered
                                                                }
                                                            }}
                                                            className="w-full">
                                                        {serverData.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}

                    {movie.trailer_url && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Trailer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe
                                        src={movie.trailer_url}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full rounded-lg"
                                    ></iframe>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Movie */}
            <div
                ref={videoSectionRef}
                className={"container mx-auto px-36 mt-8"}>
                <AspectRatio ratio={16 / 9} className={"border-2 border-gray-300 shadow-lg rounded-lg"}>
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
        </div>
    )
}