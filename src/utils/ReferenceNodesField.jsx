import React from 'react'

import { ReferenceArrayField } from 'react-admin'

export const ReferenceNodesField = ({ record, source, ...props }) => {
  const data = record[source]
  return !data ? null : (
    <ReferenceArrayField
      record={{ source: Object.keys(data.nodes).map(key => data.nodes[key].id) }}
      source="source"
      {...props}
    />
  )
}
