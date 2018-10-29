import React from 'react'
import PropTypes from 'prop-types'
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateInput,
  DisabledInput,
  Edit,
  EditButton,
  Filter,
  List,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin'

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
      <DateField source="updatedAt" />
      <TextField source="title" />
      <TextField source="stub" />
      <BooleanField source="published" />
      <EditButton basePath="/Post" />
    </Datagrid>
  </List>
)

const PostTitle = ({ record }) => {
  return <span>Post {record ? `"${record.title}"` : ''}</span>
}
PostTitle.propTypes = {
  record: PropTypes.object,
}

export const PostEdit = props => (
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="title" />
      <TextInput source="image" />
      <TextInput source="stub" />
      <BooleanInput label="Published" source="published" />
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
)

export const PostCreate = props => (
  <Create title="Neuen Benutzer anlegen" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="stub" />
      <TextInput source="image" />
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)
