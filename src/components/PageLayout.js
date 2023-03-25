import SearchAppBar from './SearchAppBar'
import { Outlet } from 'react-router-dom'

export const PageLayout = ({ handleInputChange }) => {
  return (
    <>
      <SearchAppBar
        handleInputChange={handleInputChange} />
      
      <Outlet />
    </>
  )
}