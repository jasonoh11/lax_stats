import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavBar.css";
import { NavLink } from "react-router-dom";

function NavBar() {

  return (
    <Navbar
      expand="md"
      className="bg-body-tertiary custom-navbar"
      variant="dark"
    >
      <Container>
        <a href="/"><img src="/white-logo.png" alt="" className="nav-logo mx-2"/></a>
        <Navbar.Brand href="/" className="nav-title">MCLAIndex</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink
              to="/"
              className="nav-link"
              end
            >
              Ratings
            </NavLink>
            <NavLink
              to="/how-it-works"
              className="nav-link"
            >
              How It Works
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
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
