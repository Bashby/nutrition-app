// Vendor libs
import { size } from "lodash";
import * as React from "react";
import { Table } from "react-bootstrap";

interface State {
    precision: number,
}

interface Props {
    data: number[][]
}

// Form Result Visuals: MR Matrix Table
export class ResultMRNTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            precision: 4,
        };
    }

    render() {
        // Compute
        let recipeCount: number = size(this.props.data) ? size(this.props.data[0]) : 0;

        // Build the table headers
        let headers: JSX.Element[] = [<th>Meal</th>];
        for (let i=1; i<= recipeCount; i++) {
            headers.push(<th>{"Ing. " + i.toString() + " (g)"}</th>);
        }

        // Build the table rows
        let rows: JSX.Element[] = [];
        for (let i=1; i<= size(this.props.data); i++) {
            let cells: JSX.Element[] = [<td>{i.toString()}</td>];
            for (let j=0; j< size(this.props.data[i-1]); j++) {
                cells.push(
                    <td title={this.props.data[i-1][j].toString()}>
                        {
                            this.props.data[i-1][j].toPrecision(this.state.precision).includes('e') ? parseFloat(this.props.data[i-1][j].toPrecision(this.state.precision)) : this.props.data[i-1][j].toPrecision(this.state.precision)
                        }
                    </td>
                );
            }
            rows.push(
                <tr>
                    {cells}
                </tr>
            );
        }

        // Render
        return (
            <div>
                <h3>MRN Matrix (Meal by Nutrient)</h3>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </div>
        );
    }
}
