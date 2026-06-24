import { useState } from "react";
import type { RepositoryData } from "../types";
import { githubApi } from "../services/api";

export const useRepoAnalyzer = () => {
    const [data, setData] = useState<RepositoryData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const analyze = async (url: string) => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await githubApi.analyzeRepository(url);

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