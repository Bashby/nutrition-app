// Vendor libs
import { size } from "lodash";
import * as React from "react";
import { Table, Panel } from "react-bootstrap";
import { ResultMTable } from "./ResultVisuals/ResultMTable";
import { ResultRTable } from "./ResultVisuals/ResultRTable";
import { ResultNTable } from "./ResultVisuals/ResultNTable";
import { ResultMRTable } from "./ResultVisuals/ResultMRTable";
import { ResultRNTable } from "./ResultVisuals/ResultRNTable";
import { ResultMRNTable } from "./ResultVisuals/ResultMRNTable";
import { ResultErrorTable } from "./ResultVisuals/ResultErrorTable";

interface State {
}

interface Props {
    m: number[][],
    r: number[][],
    n: number[][],
    t: number[][],
    mealPlaintext?: string[],
    recipePlaintext?: string[],
    ingredientPlaintext?: string[],
    nutrientPlaintext?: string[]
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

    subtract(m1: number[][], m2: number[][]) {
        let m1row = size(m1), 
            m1col = m1row ? size(m1[0]) : 0,
            m2row = size(m2),
            m2col = m2row ? size(m2[0]) : 0;

        if (m1col !== m2col || m1row !== m2row) {
            throw new Error("Matrix Subtract Size Mismatch Error.");
        } else if (!m1row || !m1col || !m2row || !m2col) {
            return undefined;
        }

        let result = new Array(m1row);
        for (let row=0; row < m1row; row++) {
            result[row] = new Array(m1col);
            for (let col=0; col < m1col; col++) {
                result[row][col] = m1[row][col] - m2[row][col];
            }
        }
        return result;
    };

    render() {
        // Compute
        let mr: number[][];
        let rn: number[][];
        let mrn: number[][];
        let error: number[][];

        if (this.props.m && this.props.r) {
            mr = this.dotProduct(this.props.m, this.props.r);
        }

        if (this.props.r && this.props.n){
            rn = this.dotProduct(this.props.r, this.props.n);
        }
        
        if (mr && this.props.n) {
            mrn = this.dotProduct(mr, this.props.n);
        }
        
        if (mrn && this.props.t) {
            error = this.subtract(mrn, this.props.t);
        }

        // Render
        return (
            <Panel header={"Result Visuals"}>
                {this.props.m && <ResultMTable
                    data={this.props.m}
                    showTotals={true}
                    meals={this.props.mealPlaintext}
                    recipes={this.props.recipePlaintext}
                />}
                {this.props.r && <ResultRTable
                    data={this.props.r}
                    showTotals={true}
                    recipes={this.props.recipePlaintext}
                    ingredients={this.props.ingredientPlaintext}
                />}
                {this.props.n && <ResultNTable
                    data={this.props.n}
                    showTotals={true}
                    ingredients={this.props.ingredientPlaintext}
                    nutrients={this.props.nutrientPlaintext}
                />}
                {mr && <ResultMRTable
                    data={mr}
                    showTotals={true}
                    meals={this.props.mealPlaintext}
                    ingredients={this.props.ingredientPlaintext}
                />}
                {rn && <ResultRNTable
                    data={rn}
                    showTotals={true}
                    recipes={this.props.recipePlaintext}
                    nutrients={this.props.nutrientPlaintext}
                />}
                {mrn && <ResultMRNTable
                    data={mrn}
                    showTotals={true}
                    meals={this.props.mealPlaintext}
                    nutrients={this.props.nutrientPlaintext}
                />}
                {error && <ResultErrorTable
                    data={error}
                    showTotals={true}
                    meals={this.props.mealPlaintext}
                    nutrients={this.props.nutrientPlaintext}
                />}
            </Panel>
        );
    }
}
