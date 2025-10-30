import React from 'react';
import type { PullRequest } from '../types/github';

export interface PRListProps {
  pullRequests: PullRequest[];
  onSelect?: (id: string | number) => void;
}

export default function PRList({ pullRequests, onSelect }: PRListProps) {
  if (!pullRequests.length) {
    return <div>No pull requests</div>;
  }

  return (
    <ul>
      {pullRequests.map((pr) => (
        <li key={pr.id}>
          <button type="button" onClick={() => onSelect?.(pr.id)}>
            {pr.number !== undefined ? `#${pr.number} ` : ''}{pr.title}
          </button>
        </li>
      ))}
    </ul>
  );
}


