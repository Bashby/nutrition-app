// Vendor libs
import * as React from "react";
import { } from "react-bootstrap";

interface State {
}

interface Props {
    day: string,
    participant: string
    type: string,
    f: string,
    c: string,
    p: string
}

// Nutrient Table Row
export class Row extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        // Render
        return (
            <tr>
                <td>{this.props.day}</td>
                <td>{this.props.participant}</td>
                <td>{this.props.type}</td>
                <td>{this.props.f}</td>
                <td>{this.props.c}</td>
                <td>{this.props.p}</td>
            </tr>
        );
    }
}
