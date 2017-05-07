// Vendor libs
import * as React from "react";
import { Button } from 'react-bootstrap';

// Local libs
import { Header } from "./Layout/Header";
import { Footer } from "./Layout/Footer";
import { Body } from "./Layout/Body"

// Layout
export class Layout extends React.Component<{}, {}> {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Header />
                <Body />
                <Footer />
            </div>
        );
    }
}