import PropTypes from 'prop-types';
import './TechnologyList.css';

function TechnologyList({
                            technologies,
                            onLoadResources,
                            resourceLoadingId,
                            renderActions,
                            emptyMessage,
                            maxItems
                        }) {
    const displayedTechnologies = (technologies || []).slice(0, maxItems ?? technologies.length);

    if (!displayedTechnologies.length) {
        return (
            <div className="api-empty-state">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="api-technologies-grid">
            {displayedTechnologies.map((tech) => (
                <article key={tech.id} className="api-technology-card">
                    <div className="api-card-header">
                        <span className="api-category">{tech.category}</span>
                        <span className={`api-difficulty difficulty-${tech.difficulty}`}>
              {tech.difficulty}
            </span>
                    </div>
                    <h3>{tech.title}</h3>
                    <p>{tech.description}</p>

                    {tech.brand && (
                        <div className="api-brand">Бренд: {tech.brand}</div>
                    )}

                    {tech.resources?.length > 0 && (
                        <div className="api-resources">
                            <span>Ресурсы:</span>
                            <ul>
                                {tech.resources.slice(0, 3).map((resource, index) => (
                                    <li key={index}>
                                        <a href={resource} target="_blank" rel="noreferrer">
                                            {resource.replace(/^https?:\/\//, '').split('/')[0]}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {typeof onLoadResources === 'function' && Number.isFinite(tech.id) && (
                        <button
                            type="button"
                            className="api-resource-button"
                            onClick={() => onLoadResources(tech.id)}
                            disabled={resourceLoadingId === tech.id}
                        >
                            {resourceLoadingId === tech.id ? 'Загружаю ресурсы...' : 'Загрузить дополнительные ресурсы'}
                        </button>
                    )}

                    {renderActions && (
                        <div className="api-card-actions">
                            {renderActions(tech)}
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
}

TechnologyList.propTypes = {
    technologies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            category: PropTypes.string,
            difficulty: PropTypes.string,
            resources: PropTypes.arrayOf(PropTypes.string),
            brand: PropTypes.string
        })
    ),
    onLoadResources: PropTypes.func,
    resourceLoadingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    renderActions: PropTypes.func,
    emptyMessage: PropTypes.string,
    maxItems: PropTypes.number
};

TechnologyList.defaultProps = {
    technologies: [],
    emptyMessage: 'Список технологий пуст',
    maxItems: undefined
};

export default TechnologyList;

