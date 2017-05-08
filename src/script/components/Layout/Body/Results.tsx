// Vendor libs
import * as React from "react";
import { Panel } from "react-bootstrap";

interface State {
}

interface Props {
    results: string
}

// Results
export class Results extends React.Component<Props, State> {
     constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Panel header={"Query Results"}>
                {this.props.results}
            </Panel>
        );
    }
}