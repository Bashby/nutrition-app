// Vendor libs
import * as React from "react";
import { Image, Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';

// AppNavbar
export class AppNavbar extends React.Component<{}, {}> {
    render() {
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#"><Glyphicon glyph="glyphicon glyphicon-leaf" /> Nutrition "Blackbox" App</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <Navbar.Text pullRight>
                            Hi Anonymous!
                        </Navbar.Text>
                        <Navbar.Text pullRight>
                            <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y&s=20" responsive />
                        </Navbar.Text>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}