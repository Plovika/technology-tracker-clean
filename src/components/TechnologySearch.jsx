import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TechnologyList from './TechnologyList.jsx';
import { mapProductsToTechnologies } from '../hooks/useTechnologiesApi.js';
import './TechnologySearch.css';

const SEARCH_DEBOUNCE = 500;

function TechnologySearch({ onAddTechnology }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);
    const debounceRef = useRef(null);
    const successTimeoutRef = useRef(null);
    const [addingId, setAddingId] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            setError(null);
            controllerRef.current?.abort();
            return undefined;
        }

        setLoading(true);
        setError(null);

        debounceRef.current = setTimeout(async () => {
            controllerRef.current?.abort();
            const controller = new AbortController();
            controllerRef.current = controller;

            try {
                const response = await fetch(
                    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=12&select=id,title,description,category,rating,thumbnail,images,brand`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error('Не удалось выполнить поиск');
                }

                const data = await response.json();
                setResults(mapProductsToTechnologies(data.products || []));
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err?.message || 'Ошибка поиска');
            } finally {
                setLoading(false);
            }
        }, SEARCH_DEBOUNCE);

        return () => {
            clearTimeout(debounceRef.current);
            controllerRef.current?.abort();
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, [query]);

    const handleAdd = async (tech) => {
        if (typeof onAddTechnology !== 'function') {
            return;
        }

        try {
            setAddingId(tech.id);
            setActionError(null);
            await onAddTechnology({
                title: tech.title,
                description: tech.description,
                category: tech.category,
                difficulty: tech.difficulty,
                resources: tech.resources
            });
            setActionMessage(`Технология «${tech.title}» добавлена в трекер`);
            successTimeoutRef.current = setTimeout(() => setActionMessage(''), 2500);
        } catch (err) {
            setActionError(err?.message || 'Не удалось добавить технологию');
        } finally {
            setAddingId(null);
        }
    };

    return (
        <section className="technology-search">
            <header>
                <div>
                    <h2>🔍 Поиск технологий в API</h2>
                    <p>Используйте debounce-поиск, чтобы найти нужную технологию и добавить её в трекер</p>
                </div>
            </header>

            <div className="search-input-wrapper">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Например: react, node, mobile..."
                />
                {query && (
                    <button
                        type="button"
                        className="clear-btn"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                        }}
                    >
                        Очистить
                    </button>
                )}
            </div>

            {loading && (
                <div className="search-status">Поиск технологий...</div>
            )}

            {error && (
                <div className="search-error">{error}</div>
            )}

            {actionError && (
                <div className="search-error">{actionError}</div>
            )}

            {actionMessage && (
                <div className="search-status success">{actionMessage}</div>
            )}

            {!loading && query && results.length === 0 && !error && (
                <div className="search-status">Ничего не найдено</div>
            )}

            {results.length > 0 && (
                <TechnologyList
                    technologies={results}
                    renderActions={(tech) => (
                        <button
                            type="button"
                            className="api-resource-button"
                            onClick={() => handleAdd(tech)}
                            disabled={addingId === tech.id}
                        >
                            {addingId === tech.id ? 'Добавляю...' : 'Добавить в трекер'}
                        </button>
                    )}
                />
            )}
        </section>
    );
}

TechnologySearch.propTypes = {
    onAddTechnology: PropTypes.func
};

export default TechnologySearch;

