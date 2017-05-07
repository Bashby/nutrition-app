// Vendor libs
import { isFinite, toNumber, isEmpty } from "lodash";
import * as React from "react";
import { FormGroup, ControlLabel, FormControl, HelpBlock, Table } from "react-bootstrap";

// Local
import { FieldGroup } from "./Form/FieldGroup";

interface State {
    queryResult?: string,
    mealplanParticipantCount?: number,
    mealplanTotalDays?: number,
    mealplanMealsPerDay?: number
}

interface Props {
}

// Form
export class Form extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            // queryResult: "",
            // mealplanParticipantCount: 0,
            // mealplanTotalDays: 0,
            // mealplanMealsPerDay: 0,
        };
    }

    mealplanParticipantCountOnChangeHandler(e: React.FormEvent<any>) { this.setState({mealplanParticipantCount: e.currentTarget.value}); }
    mealplanTotalDaysOnChangeHandler(e: React.FormEvent<any>) { this.setState({mealplanTotalDays: e.currentTarget.value}); }
    mealplanMealsPerDayOnChangeHandler(e: React.FormEvent<any>) { this.setState({mealplanMealsPerDay: e.currentTarget.value}); }

    formValidatorIsNumber(value: string): "success" | "warning" | "error" | undefined {
        // Short processing if nothing to process
        if (isEmpty(value)) { return undefined; }

        // Return success if the value is a finite number
        if (isFinite(toNumber(value))) {
            return "success";
        } else {
            return "error";
        }
    }

    render() {
        return (
            <form>
                <FieldGroup
                    id={"Input_peopleCount"}
                    label={"Participant Count"}
                    type={"input"}
                    help={"Enter the number of people you would like to plan a meal for."}
                    placeholder={"enter a number"}
                    onChangeHandler={this.mealplanParticipantCountOnChangeHandler.bind(this)}
                    elementValue={this.state.mealplanParticipantCount ? this.state.mealplanParticipantCount.toString() : ""}
                    validationStateResolver={this.formValidatorIsNumber}
                    validationMessages={{error: "Participant Count must be a number."}}
                />
                <FieldGroup
                    id={"Input_mealplanLength"}
                    label={"Mealplan Length"}
                    type={"input"}
                    help={"Enter the number of days you would like to plan a meal for."}
                    placeholder={"enter a number"}
                    onChangeHandler={this.mealplanTotalDaysOnChangeHandler.bind(this)}
                    elementValue={this.state.mealplanTotalDays ? this.state.mealplanTotalDays.toString() : ""}
                    validationStateResolver={this.formValidatorIsNumber}
                    validationMessages={{error: "Mealplan Length must be a number."}}
                />
                <FieldGroup
                    id={"Input_mealsPerDay"}
                    label={"Meals Per Day"}
                    type={"input"}
                    help={"Enter the number of meals per person, per day. This is the same for all people in the meal plan."}
                    placeholder={"enter a number"}
                    onChangeHandler={this.mealplanMealsPerDayOnChangeHandler.bind(this)}
                    elementValue={this.state.mealplanMealsPerDay ? this.state.mealplanMealsPerDay.toString() : ""}
                    validationStateResolver={this.formValidatorIsNumber}
                    validationMessages={{error: "Meals Per Day must be a number."}}
                />

                <h3>Edit as needed</h3>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
            </form>
        );
    }

    private request() {
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
                "num_iterations" : 3000,
                "num_seconds" : 0.9,
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
                ]
            })
        })
        .then((response) => { return response.text(); })
        .then((response) => { this.setState({queryResult: response}); })
        .catch((error) => {
            console.error(error);
        });
    }
}