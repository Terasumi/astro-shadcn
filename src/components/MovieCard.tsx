import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


interface MovieCardProps {
    slug: string
    name: string
    original_name: string
    current_episode: number
    total_episodes: number
    quality: string
    language: string
    image: string
}

export default function MovieCard({
                              slug,
                              name,
                              original_name,
                              current_episode,
                              total_episodes,
                              quality,
                              language,
                              image
                          }: MovieCardProps) {
    return (
        <a href={`/phim/${slug}`} className="group">
            <Card className="overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105">
                <div className="relative aspect-[2/3]">
                    {/*Optimzed Image*/}
                    <img
                        className="object-fill"
                        src={image}
                        alt={name}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h2 className="text-white text-lg font-semibold line-clamp-2">{name}</h2>
                        <p className="text-gray-300 text-sm">{original_name}</p>
                    </div>
                </div>
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                        Episodes: {current_episode} / {total_episodes}
                    </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                    <Badge variant="secondary">{quality}</Badge>
                    <Badge variant="outline">{language}</Badge>
                </CardFooter>
            </Card>
        </a>
    )
}