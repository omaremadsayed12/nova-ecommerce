import { NavLink } from "react-router-dom"
import Container from "../Container"

function MobileMenu({navItems, onClose}) {
  return (
    <div className="mobile-menu">
          <Container className="py-4">
            <nav>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${isActive ? "active" : "text-slate-600"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </Container>
        </div>
  )
}

export default MobileMenu