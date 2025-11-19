import { useState } from 'react';
import PropTypes from 'prop-types';

const ROADMAP_API_URL = 'https://dummyjson.com/recipes?limit=6';

export const normalizeRoadmapPayload = (payload) => {
  const rawItems =
    payload?.technologies ??
    payload?.recipes ??
    payload?.items ??
    [];

  return rawItems.map((item, index) => ({
    title: item.title || item.name || `Технология ${index + 1}`,
    description:
      item.description ||
      (Array.isArray(item.instructions)
        ? item.instructions.slice(0, 2).join(' ')
        : 'Описание отсутствует'),
    category: item.category || item.cuisine || 'roadmap',
    difficulty: (item.difficulty || 'intermediate').toLowerCase(),
    resources: item.tags || item.resources || []
  }));
};

function RoadmapImporter({ onImportTechnologies }) {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);

  const handleImportRoadmap = async (roadmapUrl) => {
    try {
      setImporting(true);
      setError(null);

      // Реальная загрузка дорожной карты из публичного API DummyJSON
      const response = await fetch(roadmapUrl);
      if (!response.ok) throw new Error('Не удалось загрузить дорожную карту');

      const roadmapData = await response.json();
      const technologiesFromRoadmap = normalizeRoadmapPayload(roadmapData);

      if (!technologiesFromRoadmap.length) {
        throw new Error('API вернул пустой список технологий');
      }

      if (typeof onImportTechnologies === 'function') {
        await onImportTechnologies(technologiesFromRoadmap);
      }
    } catch (err) {
      setError(err?.message || 'Ошибка импорта дорожной карты');
    } finally {
      setImporting(false);
    }
  };

  const handleExampleImport = () => {
    handleImportRoadmap(ROADMAP_API_URL);
  };

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожной карты</h3>

      <div className="import-actions">
        <button
          onClick={handleExampleImport}
          disabled={importing}
          className="import-button"
        >
          {importing ? 'Импорт...' : 'Импорт пример дорожной карты'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

RoadmapImporter.propTypes = {
  onImportTechnologies: PropTypes.func
};

export default RoadmapImporter;

