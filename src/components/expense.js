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
  NumberField,
  NumberInput,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SingleFieldList,
  TextField,
  ChipField,
  SimpleForm,
  TextInput,
} from 'react-admin'
import { ReferenceNodesField } from '../utils/ReferenceNodesField'
import { TagsArrayField, TagsArrayReferenceInput } from './tag'

import Redo from '@material-ui/icons/Redo'
export const ExpenseIcon = Redo

export const ExpenseFilter = props => (
  <Filter {...props}>
    <TextInput label="Title" source="title" />
  </Filter>
)

export const ExpenseList = props => (
  <List {...props} filters={<ExpenseFilter />}>
    <Datagrid>
      <NumberField source="amount" options={{ style: 'currency', currency: '€' }} />
      <ReferenceField label="Account" source="account.id" reference="Account">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField label="User" source="user.id" reference="User">
        <ChipField source="name" />
      </ReferenceField>
      <EditButton basePath="/Expense" />
    </Datagrid>
  </List>
)

const ExpenseTitle = ({ record }) => {
  return <span>Expense {record ? `(${record.amount})` : ''}</span>
}
ExpenseTitle.propTypes = {
  record: PropTypes.object,
}

export const ExpenseEdit = props => (
  <Edit title={<ExpenseTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="createdAt" />
      <DateInput source="updatedAt" />
      <NumberInput source="amount" />
      <TagsArrayReferenceInput />
      <BooleanInput label="Published" source="published" />
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
)

export const ExpenseCreate = props => (
  <Create title="Neuen Expense anlegen" {...props}>
    <SimpleForm>
      <NumberInput source="amount" />
      <ReferenceInput label="User" source="author.id" reference="User">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)
