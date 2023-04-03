import SearchAppBar from './SearchAppBar'
import { Outlet } from 'react-router-dom'

export const PageLayout = ({ handleInputChange, handleSubmit }) => {
  return (
    <>
      <SearchAppBar
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit } />
      <Outlet />
    </>
  )
}