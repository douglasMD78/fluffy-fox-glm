import React from 'react';
import { RecipeClassification } from './RecipeClassification';

interface TagListProps {
    tags: string;
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
    return <RecipeClassification tags={tags} compact={true} />;
};