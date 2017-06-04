// Vendor libs
import { size } from "lodash";
import * as React from "react";
import { Table, Button, Panel, Glyphicon } from "react-bootstrap";

interface State {
    precision: number,
    open: boolean,
    text: string,
}

interface Props {
    data: number[][],
    meals?: string[],
    nutrients?: string[],
    showTotals: boolean
}

// Form Result Visuals: MR Matrix Table
export class ResultMRNTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            precision: 4,
            open: false,
            text: "show",
        };
    }

    render() {
        // Compute
        let recipeCount: number = size(this.props.data) ? size(this.props.data[0]) : 0;

        // Build the table headers
        let headers: JSX.Element[] = [<th>Meal</th>];
        for (let i=1; i<= recipeCount; i++) {
            let nutrientText = this.props.nutrients ? this.props.nutrients[i-1].toString() : "Nutr. " + i.toString() + " (g)";
            headers.push(<th>{nutrientText}</th>);
        }

        // Add Totals Column, if set
        if (this.props.showTotals) {
            headers.push(<th>{"Total"}</th>);
        }

        // Build the table rows
        let rows: JSX.Element[] = [];
        let columnTotals: number[] = Array.from({length: size(this.props.data[0])}, () => 0);
        for (let i=1; i<= size(this.props.data); i++) {
            let mealText = this.props.meals ? this.props.meals[i-1].toString() : i.toString();
            let cells: JSX.Element[] = [<td>{mealText}</td>];
            let rowTotal: number = 0;
            for (let j=0; j< size(this.props.data[i-1]); j++) {
                rowTotal += this.props.data[i-1][j];
                columnTotals[j] += this.props.data[i-1][j];
                cells.push(
                    <td title={this.props.data[i-1][j].toString()}>
                        {
                            this.props.data[i-1][j].toPrecision(this.state.precision).includes('e') ? parseFloat(this.props.data[i-1][j].toPrecision(this.state.precision)) : this.props.data[i-1][j].toPrecision(this.state.precision)
                        }
                    </td>
                );
            }

            // Calulate "Total Row" cell, if set
            if (this.props.showTotals) {
                cells.push(
                    <td title={rowTotal.toString()}>
                        {
                            rowTotal.toPrecision(this.state.precision).includes('e') ? parseFloat(rowTotal.toPrecision(this.state.precision)) : rowTotal.toPrecision(this.state.precision)
                        }
                    </td>
                );
            }

            rows.push(<tr>{cells}</tr>);
        }

        // Calulate "Total Column" row, if set
        if (this.props.showTotals) {
            let totalCells: JSX.Element[] = [<td>{"Total"}</td>];
            for (let k = 0; k < size(columnTotals); k++) {
                totalCells.push(
                    <td title={columnTotals[k].toString()}>
                        {
                            columnTotals[k].toPrecision(this.state.precision).includes('e') ? parseFloat(columnTotals[k].toPrecision(this.state.precision)) : columnTotals[k].toPrecision(this.state.precision)
                        }
                    </td>
                );
            }
            rows.push(<tr>{totalCells}</tr>);
        }

        // Render
        return (
            <div>
                <span>MRN Matrix (Meal by Nutrient)</span>
                <Button 
                    bsStyle="link"
                    bsSize="small"
                    onClick={ () => {
                        this.setState({ open: !this.state.open });
                        this.setState({ text: this.state.open ? "show" : "hide"});
                    }}
                >
                    <Glyphicon glyph="list" /> {this.state.text}
                </Button>
                <Panel collapsible expanded={this.state.open}>
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
                </Panel>
            </div>
        );
    }
}
