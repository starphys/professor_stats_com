import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import Logout from './Logout'

function Navbar ({ token, setUserToken }) {
  return (
    <nav className='nav-container'>
      <Link to='/' className='site-title'>
        ProfStats
      </Link>
      <ul className='navbar-links'>
        {token ? '' : <CustomLink to='/signup'>Sign up</CustomLink>}
        {token ? '' : <CustomLink to='/login'>Log in</CustomLink>}
        {token ? <CustomLink to={`/user/${token.username}`}>Account</CustomLink> : ''}
        {token ? <Logout setUserToken={setUserToken} /> : ''}
      </ul>
    </nav>
  )
}
function CustomLink ({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

export default Navbar
