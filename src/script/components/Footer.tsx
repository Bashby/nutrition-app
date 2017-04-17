// Vendor libs
import * as React from "react";
import { Label, Glyphicon, Well } from 'react-bootstrap';

// Footer
export class Footer extends React.Component<{}, {}> {
    render() {
        return (
            <footer className="footer"><Well bsSize="small"><Label bsStyle="default">© 2017 Nutrition App Team <Glyphicon glyph="glyphicon glyphicon glyphicon-heart" /></Label> | <Label bsStyle="warning">All Rights Reserved <Glyphicon glyph="glyphicon glyphicon glyphicon glyphicon-alert" /> </Label></Well></footer>
        );
    }
}