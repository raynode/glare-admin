import React from 'react'
import {
  ArrayField,
  ChipField,
  ReferenceArrayField,
  ReferenceArrayInput,
  SelectArrayInput,
  SingleFieldList,
} from 'react-admin'

export const TagDisplayField = ({ data,...props }) => !data ? null : (
  <ReferenceArrayField
    record={{ source: Object.keys(data).map(key => data[key].id) }}
    reference="Tag"
    source="source"
    {...props}
  >
    <SingleFieldList>
      <ChipField source="tag" />
    </SingleFieldList>
  </ReferenceArrayField>
)

export const TagsArrayField = props => (
  <ArrayField {...props} source="tags.nodes">
    <TagDisplayField />
  </ArrayField>
)

export const TagsArrayReferenceInput = props => (
  <ReferenceArrayInput {...props} allowEmpty label="Tags" source="tags.nodes" reference="Tag">
    <SelectArrayInput optionText="tag" />
  </ReferenceArrayInput>
)
