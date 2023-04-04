import SearchAppBar from './SearchAppBar'
import { Outlet } from 'react-router-dom'

export const PageLayout = ({ handleInputChange, handleSubmit }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <SearchAppBar
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit } />
      <Outlet />
    </div>
  )
}