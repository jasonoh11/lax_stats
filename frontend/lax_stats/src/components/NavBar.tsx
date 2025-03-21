import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavBar.css";
import { NavLink, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary custom-navbar"
      variant="dark"
    >
      <Container>
        <Navbar.Brand href="/">MCLAIndex</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink
              to="/"
              className="nav-link"
              activeClassName="active-link"
              end
            >
              Ratings
            </NavLink>
            <NavLink
              to="/how-it-works"
              className="nav-link"
              activeClassName="active-link"
            >
              How It Works
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              activeClassName="active-link"
            >
              About
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
