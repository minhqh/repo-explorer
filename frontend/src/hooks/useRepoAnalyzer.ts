import { useState } from "react";
import type { APIResponse, RepositoryData } from "../types";

export const useRepoAnalyzer = () => {
    const [data, setData] = useState<RepositoryData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const analyze = async (url: string) => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch('http://localhost:8000/api/repository/analyze', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const result: APIResponse<RepositoryData> = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Có lỗi xảy ra từ server');
            }

            setData(result.data || null);
            } catch (err: any) {
            setError(err.message || 'Lỗi kết nối đến server');
            } finally {
            setIsLoading(false);
            }
        };

        return { data, isLoading, error, analyze };
};