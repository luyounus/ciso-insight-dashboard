import React from 'react';
import type { PullRequest } from '../types/github';

export interface PRDetailsProps {
  pullRequest: PullRequest | null;
}

export default function PRDetails({ pullRequest }: PRDetailsProps) {
  if (!pullRequest) {
    return <div>Select a pull request to view details</div>;
  }

  return (
    <div>
      <h2>
        PR #{pullRequest.number}: {pullRequest.title}
      </h2>
      <div>State: {pullRequest.state}</div>
      <div>Author: {pullRequest.author}</div>
      <div>Created: {pullRequest.createdAt}</div>
      {pullRequest.updatedAt ? <div>Updated: {pullRequest.updatedAt}</div> : null}
      {pullRequest.mergedAt ? <div>Merged: {pullRequest.mergedAt}</div> : null}
    </div>
  );
}


