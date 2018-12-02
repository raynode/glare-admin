import React from 'react'
import PropTypes from 'prop-types'
import {
  BooleanField,
  BooleanInput,
  ChipField,
  Create,
  Datagrid,
  DateInput,
  DisabledInput,
  Edit,
  EditButton,
  Filter,
  List,
  NumberField,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  SingleFieldList,
  TextInput,
} from 'react-admin'
import { ReferenceNodesField } from '../utils/ReferenceNodesField'
import { TagsArrayField, TagsArrayReferenceInput } from './tag'

import AccountBalance from '@material-ui/icons/AccountBalance'
export const AccountIcon = AccountBalance

export const AccountFilter = props => (
  <Filter {...props}>
    <TextInput label="Title" source="title" />
  </Filter>
)

export const AccountList = props => (
  <List {...props} filters={<AccountFilter />}>
    <Datagrid>
      <NumberField source="amount" options={{ style: 'currency', currency: '€' }} />
      <BooleanField source="published" />
      <EditButton basePath="/Account" />
      <TagsArrayField />
      <ReferenceNodesField label="Owner" reference="User" source="owners">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceNodesField>
    </Datagrid>
  </List>
)

const AccountTitle = ({ record }) => {
  return <span>Account {record ? `(${record.amount})` : ''}</span>
}
AccountTitle.propTypes = {
  record: PropTypes.object,
}

export const AccountEdit = props => (
  <Edit title={<AccountTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="createdAt" />
      <DateInput source="updatedAt" />
      <NumberInput source="amount" />
      <TagsArrayReferenceInput />
      <ReferenceArrayInput label="Owner" source="owners.nodesIds" reference="User">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
)
/*
      <ReferenceArrayInput source="expenses.nodes" reference="Expense">
        <SimpleFormIterator>
          <DateInput source="amount" />
          <TextInput source="user.id" />
        </SimpleFormIterator>
      </ReferenceArrayInput>
/* */

export const AccountCreate = props => (
  <Create title="Neuen Account anlegen" {...props}>
    <SimpleForm>
      <NumberInput source="amount" />
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)
