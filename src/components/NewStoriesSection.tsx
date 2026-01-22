import React from 'react';
import StoriesSection from './StoriesSection';
import type { Story } from '../types/api';

interface NewStoriesSectionProps {
  stories: Story[];
  cdnDomain?: string;
}

const NewStoriesSection: React.FC<NewStoriesSectionProps> = ({ stories, cdnDomain }) => {
  return (
    <StoriesSection 
      stories={stories}
      cdnDomain={cdnDomain}
      title="TRUYỆN TRANH MỚI CẬP NHẬT"
    />
  );
};

export default NewStoriesSection;
