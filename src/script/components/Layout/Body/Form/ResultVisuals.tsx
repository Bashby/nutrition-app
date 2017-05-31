// Vendor libs
import { size } from "lodash";
import * as React from "react";
import { Table, Panel } from "react-bootstrap";
import { ResultMTable } from "./ResultVisuals/ResultMTable";
import { ResultRTable } from "./ResultVisuals/ResultRTable";
import { ResultMRTable } from "./ResultVisuals/ResultMRTable";
import { ResultMRNTable } from "./ResultVisuals/ResultMRNTable";

interface State {
}

interface Props {
    m: number[][],
    r: number[][],
    n: number[][]
}

// Form Result Visuals
export class ResultVisuals extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    dotProduct(m1: number[][], m2: number[][]) {
        let m1row = size(m1), 
            m1col = m1row ? size(m1[0]) : 0,
            m2row = size(m2),
            m2col = m2row ? size(m2[0]) : 0;

        if (m1col !== m2row) {
            throw new Error("Matrix Dot Product Size Mismatch Error.");
        } else if (!m1row || !m1col || !m2row || !m2col) {
            return undefined;
        }

        let row, row2, col2;

        let result = new Array(m1row);

        for (row=0; row<m1row; ++row) {
            result[row] = new Array(m2col);

            for (col2=0; col2<m2col; ++col2) {
                result[row][col2] = 0;

                for (row2=0; row2<m2row; ++row2) {
                    result[row][col2] += m1[row][row2] * m2[row2][col2];
                }
            }
        }
        return result;
    };

    render() {
        // Compute
        let mr: number[][] = this.dotProduct(this.props.m, this.props.r);
        debugger;
        let mrn: number[][] = this.dotProduct(mr, this.props.n);

        // Render
        return (
            <Panel header={"Result Visuals"}>
                {this.props.m && <ResultMTable data={this.props.m} />}
                {this.props.r && <ResultRTable data={this.props.r}/>}
                {mr && <ResultMRTable data={mr}/>}
                {mrn && <ResultMRNTable data={mrn}/>}
            </Panel>
        );
    }
}
