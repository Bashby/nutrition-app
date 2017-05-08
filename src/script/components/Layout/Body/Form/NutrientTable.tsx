// Vendor libs
import { get, size } from "lodash";
import * as React from "react";
import { Table } from "react-bootstrap";

// Local
import { Row } from "./NutrientTable/Row";

interface State {
}

interface Props {
    mealplanLength: number,
    mealsPerDay: number,
    mealData: {
        [key: string] : {
            type: string
        }
    },
    participants: {
        [key: string] : {
            name: string,
            nutrients: {
                fats: number,
                carbs: number,
                protein: number
            }
        }
    },
}

// Form Nutrient Table
export class NutrientTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        // Compute
        var rows = [];
        for (var i=1; i <= this.props.mealplanLength; i++) {
            for (var j=1; j <= this.props.mealsPerDay; j++) {
                for (var k=1; k <= size(this.props.participants); k++) {
                    let participantName = get(this.props.participants[k], "name", "?");
                    let mealType = get(this.props.mealData[j], "type", "?");
                    rows.push(
                        <Row
                            day={i.toString()}
                            participant={participantName}
                            type={mealType}
                            f={get(this.props.participants[k], "nutrients.fats", "?").toString()}
                            c={get(this.props.participants[k], "nutrients.carbs", "?").toString()}
                            p={get(this.props.participants[k], "nutrients.protein", "?").toString()}
                        />
                    );
                }
            }
        }

        // Render
        return (
            <div>
                <h3>Nutrient Table</h3>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Partcipant</th>
                            <th>Meal</th>
                            <th>Fat (g)</th>
                            <th>Carb (g)</th>
                            <th>Protein (g)</th>
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
