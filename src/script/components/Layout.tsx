// Vendor libs
import * as React from "react";
import { Button } from 'react-bootstrap';

// Local libs
import { Header } from "./Header";
import { Footer } from "./Footer";

// Layout
export class Layout extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Header />
                <h1>It works?<Button bsStyle="primary">Primary</Button></h1>
                <Footer />
            </div>
        );
    }
}