import React from 'react'
import PropTypes from 'prop-types'
import {
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateInput,
  DisabledInput,
  Edit,
  EditButton,
  List,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin'

import BookIcon from '@material-ui/icons/Face'
export const UserIcon = BookIcon

export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <DateField source="updatedAt" />
      <TextField source="state" />
      <TextField source="nickname" />
      <TextField source="name" />
      <TextField source="email" />
      <EditButton basePath="/User" />
    </Datagrid>
  </List>
)

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.name}"` : ''}</span>
}
UserTitle.propTypes = {
  record: PropTypes.object,
}

export const UserEdit = (props) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="givenName" />
      <TextInput source="familyName" />
      <TextInput source="nickname" />
      <TextInput source="name" />
      <DisabledInput source="picture" />
      <SelectInput source="gender" allowEmpty choices={[
          { id: 'male', name: 'Männlich' },
          { id: 'female', name: 'Weiblich' },
      ]} />
      <SelectInput source="state" allowEmpty choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'member', name: 'Mitglied' },
          { id: 'guest', name: 'Gast' },
      ]} />
      <TextInput source="email" />
      <BooleanInput label="E-Mail verifiziert" source="emailVerified" />
    </SimpleForm>
  </Edit>
)

export const UserCreate = (props) => (
  <Create title="Neuen Benutzer anlegen" {...props}>
    <SimpleForm>
      <TextInput source="givenName" />
      <TextInput source="familyName" />
      <TextInput source="nickname" />
      <TextInput source="name" />
      <DisabledInput source="picture" />
      <SelectInput source="gender" allowEmpty choices={[
          { id: 'male', name: 'Männlich' },
          { id: 'female', name: 'Weiblich' },
      ]} />
      <SelectInput source="state" allowEmpty choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'member', name: 'Mitglied' },
          { id: 'guest', name: 'Gast' },
      ]} />
      <TextInput source="email" />
      <BooleanInput label="E-Mail verifiziert" source="emailVerified" />
    </SimpleForm>
  </Create>
)
