import React from 'react'
import { Admin, Resource } from 'react-admin'
import PropTypes from 'prop-types'
import { AccountList, AccountEdit, AccountCreate, AccountIcon } from './components/account'
import { UserList, UserEdit, UserCreate, UserIcon } from './components/user'
import { PostList, PostEdit, PostCreate, PostIcon } from './components/post'
import { AssetList, AssetEdit, AssetCreate, AssetIcon } from './components/asset'
import { createMuiTheme } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'

const theme = createMuiTheme({
  palette: {
    secondary: deepOrange,
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
})

export const App = ({ dataProvider }) => (
  <Admin dataProvider={dataProvider} theme={theme}>
    <Resource name="Tag" />
    <Resource name="Expense" />
    <Resource name="User" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
    <Resource name="Account" list={AccountList} edit={AccountEdit} create={AccountCreate} icon={AccountIcon} />
    <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
    <Resource name="Asset" list={AssetList} edit={AssetEdit} create={AssetCreate} icon={AssetIcon} />
  </Admin>
)

App.propTypes = {
  dataProvider: PropTypes.func,
}
