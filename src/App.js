import React from 'react'
import { Admin, Resource, ShowGuesser } from 'react-admin'
import PropTypes from 'prop-types'
import { UserList, UserEdit, UserCreate, UserIcon } from './components/user'
import { PostList, PostEdit, PostCreate, PostIcon } from './components/post'

export const App = ({ dataProvider }) =>
  <Admin dataProvider={dataProvider} >
    <Resource
      name="User"
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      icon={UserIcon}
      show={ShowGuesser}
    />
    <Resource
      name="Post"
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      icon={PostIcon}
      show={ShowGuesser}
    />
  </Admin>

App.propTypes = {
  dataProvider: PropTypes.func,
}
