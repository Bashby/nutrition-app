// Vendor libs
import * as React from "react";
import { Panel, PageHeader, Grid, Row, Col, Well } from "react-bootstrap";

// Local
import { Form }     from "./Body/Form";
import { Results }  from "./Body/Results";

// Body
export class Body extends React.Component<{}, {}> {
    render() {
        return (
            <Grid>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <PageHeader>
                            Basic Meal Planner <small>v0.1.0</small>
                        </PageHeader>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Panel>
                            <Form />
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Well>
                            <Results />
                        </Well>
                    </Col>
                </Row>
            </Grid>
        );
    }
}