import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
    currentType: string;
    currentPage?: number;
    basePath?: string; // e.g., "/danh-sach/the-loai" or "/danh-sach"
}

export default function FilterPanel({
    currentType,
    currentPage = 1,
    basePath = "/danh-sach/the-loai",
}: FilterPanelProps) {
    const [sortField, setSortField] = useState("modified.time");
    const [sortType, setSortType] = useState("desc");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [year, setYear] = useState("");
    const [limit, setLimit] = useState("10");

    // Lấy giá trị từ URL query params khi component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSortField(params.get("sort_field") || "modified.time");
        setSortType(params.get("sort_type") || "desc");
        setCategory(params.get("category") || "");
        setCountry(params.get("country") || "");
        setYear(params.get("year") || "");
        setLimit(params.get("limit") || "10");
    }, []);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("sort_field", sortField);
        params.set("sort_type", sortType);
        if (category) params.set("category", category);
        if (country) params.set("country", country);
        if (year) params.set("year", year);
        params.set("limit", limit);

        const queryString = params.toString();
        window.location.href = `${basePath}/${currentType}?${queryString}`;
    };

    const handleReset = () => {
        setSortField("modified.time");
        setSortType("desc");
        setCategory("");
        setCountry("");
        setYear("");
        setLimit("10");
        window.location.href = `${basePath}/${currentType}?page=1&sort_field=modified.time&sort_type=desc&limit=10`;
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 55 }, (_, i) => currentYear - i);


    return (
        <div className="bg-slate-950 p-6 rounded-lg shadow-md mb-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Sort Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Sắp xếp theo</label>
                    <Select value={sortField} onValueChange={setSortField}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="modified.time">Ngày cập nhật</SelectItem>
                            <SelectItem value="_id">ID Phim</SelectItem>
                            <SelectItem value="year">Năm phát hành</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Type */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Thứ tự</label>
                    <Select value={sortType} onValueChange={setSortType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Mới nhất</SelectItem>
                            <SelectItem value="asc">Cũ nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Year */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Năm phát hành</label>
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn năm..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            <SelectItem value="">Tất cả</SelectItem>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Limit */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Số lượng/trang</label>
                    <Select value={limit} onValueChange={setLimit}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="60">60</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Language Filter (optional for future use) */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Ngôn ngữ</label>
                    <Select value="" disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Tất cả</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-3">
                <Button onClick={handleApplyFilters} className="flex-1">
                    Áp dụng bộ lọc
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                    Đặt lại
                </Button>
            </div>
        </div>
    );
}
