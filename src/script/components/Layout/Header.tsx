// Vendor libs
import * as React from "react";

// Local libs
import { AppNavbar } from "./Header/Navbar";

// Header
export class Header extends React.Component<{}, {}> {
    render() {
        return (
            <header><AppNavbar /></header>
        );
    }
}