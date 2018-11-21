import React from 'react'
import PropTypes from 'prop-types'
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateInput,
  DisabledInput,
  Edit,
  EditButton,
  Filter,
  ImageField,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin'

import { TagsArrayField, TagsArrayReferenceInput } from './tag'

import SubtitlesIcon from '@material-ui/icons/Subtitles'
export const PostIcon = SubtitlesIcon

export const PostFilter = props => (
  <Filter {...props}>
    <TextInput label="Title" source="title" />
  </Filter>
)

export const PostList = props => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <ReferenceField label="Hauptbild" source="image.id" reference="Asset">
        <ImageField source="url" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="stub" />
      <BooleanField source="published" />
      <EditButton basePath="/Post" />
      <TagsArrayField />
    </Datagrid>
  </List>
)

const PostTitle = ({ record }) => {
  return <span>Post {record ? `"${record.title}"` : ''}</span>
}
PostTitle.propTypes = {
  record: PropTypes.object,
}

const imageRenderer = resource => {
  if(resource.type !== 'image')
    return null
  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <span style={{
        backgroundImage: `url(${resource.url})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: 50,
        height: 50,
        marginRight: 10,
      }} />
      <span>{resource.name}</span>
    </span>
  )
}

export const PostEdit = props => (
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="title" />
      <ReferenceInput allowEmpty label="Hauptbild" source="image.id" reference="Asset">
        <SelectInput source="url" optionText={imageRenderer} />
      </ReferenceInput>
      <TagsArrayReferenceInput />
      <TextInput source="stub" />
      <BooleanInput label="Published" source="published" />
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
)

export const PostCreate = props => (
  <Create title="Neuen Post anlegen" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="stub" />
      <TagsArrayReferenceInput />
      <ReferenceInput label="Hauptbild" source="image" reference="Asset">
        <SelectInput source="url" optionText={imageRenderer} />
      </ReferenceInput>
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)
