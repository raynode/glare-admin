import React from 'react'
import PropTypes from 'prop-types'
import {
  Create,
  Datagrid,
  DateField,
  DateInput,
  DisabledInput,
  Edit,
  EditButton,
  FileInput,
  Filter,
  ImageField,
  List,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin'

import SubtitlesIcon from '@material-ui/icons/NoteAdd'
export const AssetIcon = SubtitlesIcon

const FileNameOrImageField = ({ record = { type: 'image' }, ...rest }) => {
  if(record.rawFile)
    return <FileNameOrImageField record={record.rawFile} />
  const type = record.type.split('/')[0]
  if(type === 'image')
    return <ImageField source="url" {...rest} record={{
      ...record,
      url: record.url || record.preview,
    }} />
  return (
    <span>{record.mimetype || record.type}</span>
  )
}
export const AssetFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Title" source="title" />
  </Filter>
)

export const AssetList = (props) => (
  <List
    {...props}
    filters={<AssetFilter />}
  >
    <Datagrid>
      <DateField source="updatedAt" />
      <TextField source="name" />
      <FileNameOrImageField />
      <EditButton basePath="/Asset" />
    </Datagrid>
  </List>
)

const AssetTitle = ({ record }) => {
  return <span>Asset {record ? `"${record.name}"` : ''}</span>
}
AssetTitle.propTypes = {
  record: PropTypes.object,
}

export const AssetEdit = (props) => (
  <Edit title={<AssetTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="name" />
      <DisabledInput source="type" />
      <DisabledInput source="mimetype" />
    </SimpleForm>
  </Edit>
)

export const AssetCreate = (props) => (
  <Create title="Neue Datei hochladen" {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <FileInput source="data" label="Datei">
        <FileNameOrImageField />
      </FileInput>
    </SimpleForm>
  </Create>
)
