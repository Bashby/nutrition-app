// Vendor libs
import * as React from "react";
import { Panel, PageHeader, Grid, Row, Col, Well } from "react-bootstrap";

// Local
import { Form }     from "./Body/Form";
import { Results }  from "./Body/Results";

// Body
export class Body extends React.Component<{}, {}> {
    render() {
        // Compile
        let results = "";

        // Render
        return (
            <Grid>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <PageHeader>
                            Basic Meal Planner <small>v0.1.1</small>
                        </PageHeader>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Panel>
                            <Form results={results}/>
                        </Panel>
                    </Col>
                </Row>
                {/*<Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Well>
                            <Results results={results}/>
                        </Well>
                    </Col>
                </Row>*/}
            </Grid>
        );
    }
}