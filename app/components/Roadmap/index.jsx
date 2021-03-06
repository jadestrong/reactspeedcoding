import React from 'react';

import Card from '../Card.jsx';
import VisibleFeatureList from './VisibleFeatureList';
import FilterCategoryButton from './FilterCategoryButton';
import SearchFeature from './SearchFeature';
import { CategoryFilters } from '../../actions/roadmap';

const Roadmap = () => {
  const gridClass = 'grid grid-full grid-flex-cells large-grid-fit';
  return (
    <div className="roadmap">
      <h1>Roadmap</h1>
      <p className="default-text">This app lists latest features and content
        from ReactSpeed. It is developed in Redux and explained in the book.
        This app is work-in-progress, for demo only.
      </p>
      <div className={`${gridClass} search-filter`}>
        <Card slim>
          <SearchFeature />
        </Card>
        <Card slim>
          <FilterCategoryButton filter={CategoryFilters.SHOW_ALL} />
          <FilterCategoryButton filter={CategoryFilters.SHOW_APPS} />
          <FilterCategoryButton filter={CategoryFilters.SHOW_CHAPTERS} />
          <FilterCategoryButton filter={CategoryFilters.SHOW_COMPONENTS} />
        </Card>
      </div>
      <VisibleFeatureList />
    </div>
  );
};

export default Roadmap;
