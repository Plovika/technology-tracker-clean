import RoadmapImporter from '../components/RoadmapImporter.jsx';
import TechnologyList from '../components/TechnologyList.jsx';
import TechnologySearch from '../components/TechnologySearch.jsx';
import useTechnologiesApi from '../hooks/useTechnologiesApi.js';
import { useTechnologies as useLocalTechnologies } from '../hooks/useTechnologies.js';
import './RoadmapImport.css';

function RoadmapImport() {
  const {
    technologies: apiTechnologies,
    loading,
    error,
    refetch,
    addTechnology,
    loadAdditionalResources,
    resourceLoadingId,
    resourceError
  } = useTechnologiesApi();
  const { setTechnologies: setLocalTechnologies } = useLocalTechnologies();

  const syncWithTracker = (newTech) => {
    setLocalTechnologies((prev) => {
      if (prev.some(tech => tech.id === newTech.id)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: newTech.id,
          title: newTech.title,
          description: newTech.description,
          status: 'not-started',
          notes: ''
        }
      ];
    });
  };

  const handleAddTechnology = async (techData) => {
    const createdTech = await addTechnology(techData);
    syncWithTracker(createdTech);
    return createdTech;
  };

  const handleBulkImport = async (techs) => {
    for (const tech of techs) {
      await handleAddTechnology(tech);
    }
  };

  return (
    <div className="roadmap-import-page">
      <header className="page-header">
        <div>
          <h1>🗺️ Импорт дорожных карт</h1>
          <p>Подключите внешний API и автоматически добавьте технологии в трекер</p>
        </div>
        <button className="refresh-btn" onClick={refetch} disabled={loading}>
          {loading ? 'Обновляю...' : 'Обновить данные'}
        </button>
      </header>

      {error && (
        <div className="app-error">
          <p>{error}</p>
          <button onClick={refetch}>Попробовать снова</button>
        </div>
      )}

      <section className="roadmap-import-content">
        <div className="import-panel">
          <RoadmapImporter onImportTechnologies={handleBulkImport} />
          <TechnologySearch onAddTechnology={handleAddTechnology} />
        </div>

        <div className="import-results">
          <h2>🎯 Технологии из API</h2>

          {loading && (
            <div className="app-loading compact">
              <div className="spinner" />
              <p>Загружаем технологии...</p>
            </div>
          )}

          {resourceError && (
            <div className="app-error">
              <p>{resourceError}</p>
            </div>
          )}

          {!loading && (
            <TechnologyList
              technologies={apiTechnologies}
              onLoadResources={loadAdditionalResources}
              resourceLoadingId={resourceLoadingId}
              maxItems={12}
              emptyMessage="Пока нет технологий из API — попробуйте поиск или импорт"
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default RoadmapImport;

