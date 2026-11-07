import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

export default function App() {
    const [query, setQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        if (!query) return;

        async function getMovies() {
            setLoading(true);
            setError(false);
            try {
                const results = await fetchMovies(query);
                if (results.length === 0) {
                    toast.error('No movies found for your request.');
                }
                setMovies(results);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        getMovies();
    }, [query]);

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setMovies([]);
    };

    return (
        <div className={css.app}>
            <Toaster position="top-right" />
            <SearchBar onSubmit={handleSearch} />

            {error && <ErrorMessage />}
            {loading && <Loader />}
            {!loading && !error && (
                <MovieGrid movies={movies} onSelect={(movie) => setSelectedMovie(movie)} />
            )}

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}