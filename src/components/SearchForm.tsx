import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchForm: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/tim-kiem/${encodeURIComponent(searchQuery)}`
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-row gap-2">
            <Input
                type="text"
                placeholder="Tìm kiếm phim"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
                Tìm kiếm
            </Button>
        </form>
    )
}

export default SearchForm