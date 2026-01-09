import { useState, useCallback } from 'react';
import { musicApi, Song } from '../services/api';

interface UseMusicReturn {
    isLoading: boolean;
    error: string | null;
    search: (query: string) => Promise<Song[]>;
    getArtistData: (query: string) => Promise<any>;
    getEnglishHits: () => Promise<Song[]>;
    getMalayalamHits: () => Promise<Song[]>;
    getTamilHits: () => Promise<Song[]>;
    getHindiHits: () => Promise<Song[]>;
}

export const useMusic = (): UseMusicReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wrapApiCall = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const search = useCallback((query: string) => wrapApiCall(() => musicApi.search(query)), [wrapApiCall]);

    // New methods from musicApi
    const getArtistData = useCallback((query: string) => wrapApiCall(() => musicApi.getArtistData(query)), [wrapApiCall]);

    // Charts/Hits
    const getEnglishHits = useCallback(() => wrapApiCall(() => musicApi.getEnglishHits()), [wrapApiCall]);
    const getMalayalamHits = useCallback(() => wrapApiCall(() => musicApi.getMalayalamHits()), [wrapApiCall]);
    const getTamilHits = useCallback(() => wrapApiCall(() => musicApi.getTamilHits()), [wrapApiCall]);
    const getHindiHits = useCallback(() => wrapApiCall(() => musicApi.getHindiHits()), [wrapApiCall]);

    return {
        isLoading,
        error,
        search,
        getArtistData,
        getEnglishHits,
        getMalayalamHits,
        getTamilHits,
        getHindiHits
    };
};

