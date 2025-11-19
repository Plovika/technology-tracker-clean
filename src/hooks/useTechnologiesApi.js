import { useState, useEffect } from 'react';

const TECHNOLOGIES_API_URL =
  'https://dummyjson.com/products?limit=12&select=id,title,description,category,rating,thumbnail,images,brand';

export const mapProductsToTechnologies = (products = []) =>
  products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category ?? 'unsorted',
    difficulty:
      product.rating >= 4.5
        ? 'advanced'
        : product.rating >= 4
          ? 'intermediate'
          : 'beginner',
    resources: [],
    brand: product.brand ?? 'Unknown'
  }));

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resourceLoadingId, setResourceLoadingId] = useState(null);
  const [resourceError, setResourceError] = useState(null);

  // Загрузка технологий из публичного API DummyJSON
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(TECHNOLOGIES_API_URL);
      if (!response.ok) {
        throw new Error('Удалённый API вернул ошибку');
      }

      const data = await response.json();
      const normalized = mapProductsToTechnologies(data.products || []);
      setTechnologies(normalized);
    } catch (err) {
      const message = err?.message || 'Не удалось загрузить технологии';
      setError(message);
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление новой технологии
  const addTechnology = async (techData) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(), // В реальном приложении ID генерируется на сервере
        resources: [],
        ...techData,
        createdAt: new Date().toISOString()
      };

      setTechnologies(prev => [...prev, newTech]);
      return newTech;
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  const loadAdditionalResources = async (techId) => {
    try {
      setResourceError(null);
      setResourceLoadingId(techId);

      const response = await fetch(`https://dummyjson.com/products/${techId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить ресурсы технологии');
      }

      const product = await response.json();
      const newResources = [product.thumbnail, ...(product.images || [])].filter(Boolean);
      setTechnologies(prev =>
        prev.map(tech =>
          tech.id === techId
            ? {
                ...tech,
                resources: Array.from(new Set([...(tech.resources || []), ...newResources]))
              }
            : tech
        )
      );
      return newResources;
    } catch (err) {
      const message = err?.message || 'Ошибка загрузки ресурсов';
      setResourceError(message);
      throw err;
    } finally {
      setResourceLoadingId(null);
    }
  };

  // Загружаем технологии при монтировании
  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    loadAdditionalResources,
    resourceLoadingId,
    resourceError
  };
}

export default useTechnologiesApi;

