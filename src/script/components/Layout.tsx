// Vendor libs
import * as React from "react";
import { Button } from 'react-bootstrap';

// Local libs
import { Header } from "./Header";
import { Footer } from "./Footer";

// Layout
export class Layout extends React.Component<{}, {}> {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        fetch('http://35.163.82.225:7731/solver/test', {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                "tag" : "my test run",
                "algorithm" : "fake-0.1.0",
                "W" : [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]
                ], 
            "R" : [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
            "Rsigma" : [
                    [0.1, 0.1, 0.1],
                    [0.1, 0.1, 0.1],
                    [0.1, 0.1, 0.1]
                ],
            "N" : [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                
            "T" : [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                "num_iterations" : 3000,
                "num_seconds" : 0.9
            })
        })
        .then((response) => { return response.text(); })
        .then((response) => { this.setState({res: response}); })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <div>
                <Header />
                {/*<h1>It works?<Button bsStyle="primary">Primary</Button></h1>*/}
                <p>{this.state.res}</p>
                <Footer />
            </div>
        );
    }
}