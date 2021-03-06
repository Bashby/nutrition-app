// Vendor libs
import JSONTree from 'react-json-tree';
import {startCase, eq, findIndex, isFinite, toNumber, isEmpty, isString, toString, extend, get, size, forOwn, forEach } from "lodash";
import * as React from "react";
import { FormGroup, ControlLabel, FormControl, HelpBlock, Table, ListGroup, ListGroupItem, InputGroup, Glyphicon, Button, Well, Panel, Checkbox } from "react-bootstrap";

// Local
import { FieldGroup } from "./Form/FieldGroup";
import { NutrientTable } from "./Form/NutrientTable";
import { ResultVisuals } from "./Form/ResultVisuals";

interface State {
    nDivisor: number,
    results?: {
        m: number[][],
        r: number[][],
        n: number[][],
        t: number[][]
    },
    queryString?: string,
    queryResult?: string,
    mealplanParticipantCount?: number,
    mealplanParticipantData: {
        [key: string] : {
            name: string,
            nutrients: {
                fats: number,
                carbs: number,
                protein: number
            }
        }
    },
    mealplanTotalDays?: number,
    mealplanMealsPerDay?: number,
    mealplanMealData: {
        [key: string] : {
            type: string
        }
    }
    // Algorithm Things
    useRealAlgorithm: boolean,
    isLoading: boolean,
    rSigma: number,
    recipes: {
        [name: string]: {
            include: boolean,
            type?: string,
            ingredients: {
                [key: string]: number
            }
        }
    }
    ingredients: {
        [key: string]: {
            f: number,
            c: number,
            p: number
        }
    },
    mealPlaintext?: string[],
    recipePlaintext?: string[],
    ingredientPlaintext?: string[],
    nutrientPlaintext?: string[]
}

interface Props {
    results: string
}

// Form
export class Form extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nDivisor: 100.0,
            rSigma: 0.1,
            useRealAlgorithm: false,
            queryString: "{}",
            queryResult: "{}",
            isLoading: false,
            mealplanParticipantData: {},
            mealplanMealData: {},
            // queryResult: "",
            // mealplanParticipantCount: undefined,
            // mealplanTotalDays: undefined,
            // mealplanMealsPerDay: undefined,
            recipes: {
                "omlette": {
                    include: true,
                    ingredients: {
                        "egg whites": 100,
                        "whole wheat bread": 45,
                        "carrots": 30,
                        "cherry tomatoes": 25,
                        "salsa": 25,
                        "spinach": 20,
                        "olive oil": 5,
                        "salt": 2,
                        "pepper": 2,
                    }
                },
                "parfeit": {
                    include: true,
                    ingredients: {
                        "plain greek yogurt": 110,
                        "chia seed": 2,
                        "flax seed": 3,
                        "trail mix": 8,
                        "raspberries": 15,
                        "whey protein powder": 16,
                    }
                },
                "chicken shrimp paella": {
                    include: false,
                    ingredients: {
                        "chicken breast": 1100,
                        "shrimp cooked": 1100,
                        "olive oil": 25,
                        "quinoa raw": 200,
                        "farro raw": 200,
                        "onion": 270,
                        "tomatoes": 550,
                        "bell pepper": 400,
                        "peas": 400,
                        "lemon": 40,
                        "garlic": 20,
                        "paprika": 18,
                        "cayenne pepper": 5,
                        "basil dried": 2.5,
                        "oregano": 2,
                        "pepper": 2,
                        "salt": 2,
                    }
                },
                "garden salad": {
                    include: false,
                    ingredients: {
                        "spinach": 350,
                        "bell pepper": 310,
                        "mushrooms": 152,
                        "tomatoes": 450,
                        "olive oil": 40,
                        "balsamic vinegar": 30,
                        "lemon": 20,
                        "pepper": 1,
                        "salt": 1
                    }
                }
            },
            ingredients: {
                "egg whites": {
                    f: 0.2,
                    c: 0.7,
                    p: 11,
                },
                "whole wheat bread": {
                    f: 3.4,
                    c: 41,
                    p: 13,
                },
                "carrots": {
                    f: 0.2,
                    c: 10,
                    p: 0.9,
                },
                "cherry tomatoes": {
                    f: 0,
                    c: 4,
                    p: 1,
                },
                "salsa": {
                    f: 0,
                    c: 7,
                    p: 0,
                },
                "spinach": {
                    f: 0.4,
                    c: 3.6,
                    p: 2.9,
                },
                "olive oil": {
                    f: 100,
                    c: 0,
                    p: 0,
                },
                "salt": {
                    f: 0,
                    c: 0,
                    p: 0,
                },
                "pepper": {
                    f: 3.3,
                    c: 64,
                    p: 10,
                },
                "plain greek yogurt": {
                    f: 0,
                    c: 4,
                    p: 10.1,
                },
                "chia seed": {
                    f: 31,
                    c: 42,
                    p: 17,
                },
                "flax seed": {
                    f: 42,
                    c: 29,
                    p: 18,
                },
                "trail mix": {
                    f: 45,
                    c: 29,
                    p: 19,
                },
                "raspberries": {
                    f: 0.7,
                    c: 12,
                    p: 1.2,
                },
                "whey protein powder": {
                    f: 4.7,
                    c: 9.4,
                    p: 75,
                },
                "chicken breast": {
                    f: 3.6,
                    c: 0,
                    p: 31,
                },
                "shrimp cooked": {
                    f: 0.3,
                    c: 0.2,
                    p: 24,
                },
                "quinoa raw": {
                    f: 6.07,
                    c: 64.16,
                    p: 14.12,
                },
                "farro raw": {
                    f: 0,
                    c: 58,
                    p: 12.3,
                },
                "onion": {
                    f: 0.1,
                    c: 9,
                    p: 1.1,
                },
                "tomatoes": {
                    f: 0.2,
                    c: 3.5,
                    p: 0.8,
                },
                "bell pepper": {
                    f: 0.2,
                    c: 4.6,
                    p: 0.9,
                },
                "peas": {
                    f: 0.4,
                    c: 14,
                    p: 5,
                },
                "lemon": {
                    f: 0.3,
                    c: 9,
                    p: 1.1,
                },
                "garlic": {
                    f: 0.5,
                    c: 33,
                    p: 6,
                },
                "paprika": {
                    f: 13,
                    c: 54,
                    p: 14,
                },
                "cayenne pepper": {
                    f: 17,
                    c: 57,
                    p: 12,
                },
                "basil dried": {
                    f: 4.1,
                    c: 48,
                    p: 23,
                },
                "oregano": {
                    f: 4.3,
                    c: 69,
                    p: 9,
                },
                "mushrooms": {
                    f: 0.3,
                    c: 3.3,
                    p: 3.1,
                },
                "balsamic vinegar": {
                    f: 0,
                    c: 17,
                    p: 0.5,
                }
            }
        };
    }

    mealplanParticipantCountOnChangeHandler(e: React.FormEvent<any>) { this.setState({mealplanParticipantCount: e.currentTarget.value}); }
    mealplanTotalDaysOnChangeHandler(e: React.FormEvent<any>) { this.setState({mealplanTotalDays: e.currentTarget.value}); }
    mealplanMealsPerDayOnChangeHandler(e: React.FormEvent<any>) { this.setState({mealplanMealsPerDay: e.currentTarget.value}); }
    mealplanParticipantNameOnChangeHandler(index: string, e: React.FormEvent<any>) {
        this.setState({
            mealplanParticipantData: extend(
                this.state.mealplanParticipantData,
                {
                    [index]: extend(
                        this.state.mealplanParticipantData[index],
                        {
                            name: e.currentTarget.value
                        }
                    )
                }
            )
        });
    }
    mealplanParticipantNutrientOnChangeHandler(index: string, type: string, e: React.FormEvent<any>) {
        this.setState({
            mealplanParticipantData: extend(
                this.state.mealplanParticipantData,
                {
                    [index]: extend(
                        this.state.mealplanParticipantData[index],
                        {
                            nutrients: extend(
                                this.state.mealplanParticipantData[index].nutrients,
                                {
                                    [type]: e.currentTarget.value
                                }
                            )
                        }
                    )
                }
            )
        });
    }
    mealplanMealDataOnChangeHandler(index: string, key: string, e: React.FormEvent<any>) {
        this.setState({
            mealplanMealData: extend(
                this.state.mealplanMealData,
                {
                    [index]: extend(
                        this.state.mealplanMealData[index],
                        {
                            [key]: e.currentTarget.value
                        }
                    )
                }
            )
        });
    }
    useRealAlgorithmOnChangeHandler(e: React.FormEvent<any>) {
        this.setState({useRealAlgorithm: e.currentTarget.checked});
    }
    recipeChoiceOnChangeHandler(key: string, e: React.FormEvent<any>) {
        this.setState({
            recipes: extend(
                this.state.recipes,
                {
                    [key]: extend(
                        this.state.recipes[key],
                        {
                            include: e.currentTarget.checked
                        }
                        
                    )
                }
            )
        });
    }
    recipeTypeOnChangeHandler(key: string, e: React.FormEvent<any>) {
        this.setState({
            recipes: extend(
                this.state.recipes,
                {
                    [key]: extend(
                        this.state.recipes[key],
                        {
                            type: e.currentTarget.value
                        }
                        
                    )
                }
            )
        });
    }

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

    formValidatorIsString(value: string): "success" | "warning" | "error" | undefined {
        // Short processing if nothing to process
        if (isEmpty(value)) { return undefined; }

        // Return success if the value is a string
        if (isString(toString(value))) {
            return "success";
        } else {
            return "error";
        }
    }

    render() {
        console.log("State: ", this.state);
        
        // Compute elements
        let participantDetails = [];
        for (var i=1; i <= this.state.mealplanParticipantCount; i++) {
            participantDetails.push(
                <ListGroupItem header={"Participant " + i.toString() + " Details"}>
                    <FieldGroup
                        id={"Input_participantName_p" + i.toString()}
                        label={"Name"}
                        type={"input"}
                        help={"Enter the name of this participant"}
                        placeholder={"enter a name"}
                        onChangeHandler={this.mealplanParticipantNameOnChangeHandler.bind(this, i.toString())}
                        elementValue={this.state.mealplanParticipantData && this.state.mealplanParticipantData[i.toString()] ? this.state.mealplanParticipantData[i.toString()].name : ""}
                        validationStateResolver={this.formValidatorIsString}
                        validationMessages={{error: "Participant Name must be a string."}}
                    />
                    <FormGroup>
                        <ControlLabel>Daily Nutrient Goals</ControlLabel>
                        <FieldGroup
                            id={"Input_participantDailyFat_p" + i.toString()}
                            type={"input"}
                            help={"Enter the amount of fat this participant wants to consume in a day."}
                            placeholder={"enter an amount"}
                            onChangeHandler={this.mealplanParticipantNutrientOnChangeHandler.bind(this, i.toString(), "fats")}
                            elementValue={
                                this.state.mealplanParticipantData
                                && this.state.mealplanParticipantData[i.toString()]
                                && this.state.mealplanParticipantData[i.toString()].nutrients
                                && this.state.mealplanParticipantData[i.toString()].nutrients.fats
                                    ? this.state.mealplanParticipantData[i.toString()].nutrients.fats.toString()
                                    : ""
                            }
                            validationStateResolver={this.formValidatorIsNumber}
                            validationMessages={{error: "Fat amount must be a number."}}
                            useInputGroup={true}
                            inputGroup={{
                                pre: {icon: <Glyphicon glyph="scale" />, text: "Fat"},
                                post: {text: "grams"}
                            }}
                        />
                        <FieldGroup
                            id={"Input_participantDailyCarbs_p" + i.toString()}
                            type={"input"}
                            help={"Enter the amount of carbs this participant wants to consume in a day."}
                            placeholder={"enter an amount"}
                            onChangeHandler={this.mealplanParticipantNutrientOnChangeHandler.bind(this, i.toString(), "carbs")}
                            elementValue={
                                this.state.mealplanParticipantData
                                && this.state.mealplanParticipantData[i.toString()]
                                && this.state.mealplanParticipantData[i.toString()].nutrients
                                && this.state.mealplanParticipantData[i.toString()].nutrients.carbs
                                    ? this.state.mealplanParticipantData[i.toString()].nutrients.carbs.toString()
                                    : ""
                            }
                            validationStateResolver={this.formValidatorIsNumber}
                            validationMessages={{error: "Carbs amount must be a number."}}
                            useInputGroup={true}
                            inputGroup={{
                                pre: {icon: <Glyphicon glyph="grain" />, text: "Carbs"},
                                post: {text: "grams"}
                            }}
                        />
                        <FieldGroup
                            id={"Input_participantDailyProtein_p" + i.toString()}
                            type={"input"}
                            help={"Enter the amount of protein this participant wants to consume in a day."}
                            placeholder={"enter an amount"}
                            onChangeHandler={this.mealplanParticipantNutrientOnChangeHandler.bind(this, i.toString(), "protein")}
                            elementValue={
                                this.state.mealplanParticipantData
                                && this.state.mealplanParticipantData[i.toString()]
                                && this.state.mealplanParticipantData[i.toString()].nutrients
                                && this.state.mealplanParticipantData[i.toString()].nutrients.protein
                                    ? this.state.mealplanParticipantData[i.toString()].nutrients.protein.toString()
                                    : ""
                            }
                            validationStateResolver={this.formValidatorIsNumber}
                            validationMessages={{error: "Protein amount must be a number."}}
                            useInputGroup={true}
                            inputGroup={{
                                pre: {icon: <Glyphicon glyph="heart" />, text: "Protein"},
                                post: {text: "grams"}
                            }}
                        />
                    </FormGroup>
                </ListGroupItem>
            )
        }

        let mealNames: JSX.Element[] = [];
        for (var i=1; i <= this.state.mealplanMealsPerDay; i++) {
            mealNames.push(
                <FormGroup controlId={"Select_mealType_m" + i.toString()}>
                    <ControlLabel>{"Meal " + i.toString()}</ControlLabel>
                    <FormControl
                        componentClass="select"
                        value={
                            this.state.mealplanMealData[i.toString()]
                            && this.state.mealplanMealData[i.toString()].type
                                ? this.state.mealplanMealData[i.toString()].type
                                : ""
                        }
                        onChange={this.mealplanMealDataOnChangeHandler.bind(this, i.toString(), "type")}
                    >
                        <option value="">select a type</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                        <option value="dessert">Dessert</option>
                    </FormControl>
                </FormGroup>
            );
        }

        let recipeChoices: JSX.Element[] = [];
        let optionList: JSX.Element[] = [];
        let disableInput:boolean = false;
        forOwn(this.state.mealplanMealData, (value, key) => {
            optionList.push(<option value={key}>{"Meal " + key + ": " + startCase(value.type)}</option>);
        });
        if (isEmpty(optionList)) {
            disableInput = true;
            optionList.push(<option value="">You must set some meal types above before making a selection here</option>);
        } else {
            optionList.unshift(<option value="">select a type of meal</option>);
        }
        forOwn(this.state.recipes, (value, key) => {
            recipeChoices.push(
                <div>
                    <Checkbox checked={value.include} onChange={this.recipeChoiceOnChangeHandler.bind(this, key)}>{startCase(key)}</Checkbox>
                    {value.include && <FormControl
                        disabled={disableInput}
                        componentClass="select"
                        value={
                            this.state.recipes[key]
                            && this.state.recipes[key].type
                                ? this.state.recipes[key].type
                                : ""
                        }
                        onChange={this.recipeTypeOnChangeHandler.bind(this, key)}
                    >
                        {optionList}
                    </FormControl>}
                </div>
            );
        });
        let recipeChoicesCompiled = <FormGroup controlId={"Checkbox_selectRecipes"}><ControlLabel>{"Recipe Choices"}</ControlLabel>{recipeChoices}</FormGroup>;

        // Render
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
                <ListGroup>
                    {participantDetails}
                </ListGroup>
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
                {mealNames && mealNames.length != 0 && <ListGroup>
                    <ListGroupItem header={"Meal Types"}>
                        {mealNames}
                    </ListGroupItem>
                </ListGroup>}

                {recipeChoices && recipeChoices.length != 0 && <div>
                    {recipeChoicesCompiled}
                </div>}

                <NutrientTable
                    mealplanLength={this.state.mealplanTotalDays}
                    mealsPerDay={this.state.mealplanMealsPerDay}
                    mealData={this.state.mealplanMealData}
                    participants={this.state.mealplanParticipantData}
                />

                <Well>
                    <Checkbox
                        checked={this.state.useRealAlgorithm}
                        onChange={this.useRealAlgorithmOnChangeHandler.bind(this)}
                    >
                        Query real endpoint?
                    </Checkbox>
                    <Button
                        block
                        bsStyle="primary"
                        disabled={this.state.isLoading}
                        onClick={!this.state.isLoading ? this.queryOnClickHandler.bind(this) : null}
                    >
                        <Glyphicon glyph="apple" /> {this.state.isLoading ? 'Requesting...' : 'Execute Request'}
                    </Button>
                </Well>

                {/*TODO: Layout hack for now.*/}
                <Panel header={"Query"}>
                    <JSONTree
                        data={JSON.parse(this.state.queryString)}
                        shouldExpandNode={function() { return false; }}
                    />
                </Panel>

                {/*TODO: Layout hack for now.*/}
                <Panel header={"Query Results"}>
                    <JSONTree
                        data={JSON.parse(this.state.queryResult)}
                        shouldExpandNode={function() { return false; }}
                    />
                </Panel>

                {this.state.results && <ResultVisuals
                    m={this.state.results.m}
                    r={this.state.results.r}
                    n={this.state.results.n}
                    t={this.state.results.t}
                    mealPlaintext={this.state.mealPlaintext}
                    recipePlaintext={this.state.recipePlaintext}
                    ingredientPlaintext={this.state.ingredientPlaintext}
                    nutrientPlaintext={this.state.nutrientPlaintext}
                />}
            </form>
        );
    }

    queryOnClickHandler(): void {
        // Set state for querying
        this.setState({isLoading: true});
        this.setState({queryResult: "{}"});

        // Make request
        this.request();
    }

    request(): void {
        // Use port 7732 for the live one ("bruteforce-0.1.0")
        // Use port 7733 for the live one ("fast-0.1.0")
        let url = this.state.useRealAlgorithm ? "http://35.163.82.225:7733/solver/test" : "http://35.163.82.225:7731/solver/test";
        let algo = this.state.useRealAlgorithm ? "fast-0.1.0" : "fake-0.1.0";

        // Build a list of meal names for marking up the result matrices
        // TODO: Handle state better!
        let tempMealPlaintext: string[] = [];
        for (var i=1; i <= this.state.mealplanTotalDays; i++) {
            for (var j=1; j <= this.state.mealplanMealsPerDay; j++) {
                for (var k=1; k <= size(this.state.mealplanParticipantData); k++) {
                    let participantName = get(this.state.mealplanParticipantData[k], "name", "?");
                    let mealType = get(this.state.mealplanMealData[j], "type", "?");
                    tempMealPlaintext.push("[Day " + i.toString() + "] " + startCase(participantName) + "'s " + startCase(mealType));
                }
            }
        }
        this.setState({mealPlaintext: tempMealPlaintext});
        
        // Get unique ingredient set and active recipe information
        let ingredientSet = new Set<string>();
        let activeRecipeTypes: string[] = [];
        let activeRecipeCount: number = 0;
        let activeRecipeNamePlaintext: string[] = [];
        forOwn(this.state.recipes, function(value: {include: boolean, type?:string, ingredients: { [key: string]: number }}, key: string) {
            if (value.include) {
                activeRecipeCount += 1;
                activeRecipeNamePlaintext.push(startCase(key));
                activeRecipeTypes.push(value.type ? value.type : 'unknown');
                forOwn(value.ingredients, function(_: number, key: string) {
                    ingredientSet.add(key);
                })
            }
        });

        // Build the T, W, and A matrices
        let T: number[][] = [];
        let W: number[][] = [];
        let A: number[][] = [];
        for (var i=1; i <= this.state.mealplanTotalDays ; i++) {
            for (var j=1; j <= this.state.mealplanMealsPerDay; j++) {
                for (var k=1; k <= this.state.mealplanParticipantCount; k++) {
                    let mealType: string = get(this.state.mealplanMealData[j], "type", "???").toString();
                    let tempRow: number[] = Array.from({length: activeRecipeCount}, () => 0)
                    let f = Number(get(this.state.mealplanParticipantData[k], "nutrients.fats"));
                    let c = Number(get(this.state.mealplanParticipantData[k], "nutrients.carbs"));
                    let p = Number(get(this.state.mealplanParticipantData[k], "nutrients.protein"));

                    // Update A against current meal type
                    forEach(tempRow, (_: number, index: number) => {
                        let recipeType: string = activeRecipeTypes[index];
                        let recipeTypePlaintext: string = get(this.state.mealplanMealData[recipeType], "type").toString();
                        if (eq(mealType, recipeTypePlaintext)) {
                            tempRow[index] = 1;
                        }
                    });
                    T.push([f, c, p]);
                    W.push([1.0, 1.0, 1.0]);
                    A.push(tempRow);
                }
            }
        }

        // Build the R and R sigma matrices
        let R: number[][] = [];
        let rSigma: number[][] = [];
        forOwn(this.state.recipes, (value: {include: boolean, ingredients: { [key: string]: number }}) => {
            if (value.include) {
                let tempRow: number[] = Array.from({length: ingredientSet.size}, () => 0)
                let tempRowSigma: number[] = Array.from({length: ingredientSet.size}, () => this.state.rSigma)
                let rowSum: number = 0;
                forOwn(value.ingredients, function(value: number, key: string) {
                    let targetIndex = findIndex(Array.from(ingredientSet), function(value: string) {
                        return eq(value, key);
                    })
                    tempRow[targetIndex] = value;
                    rowSum += value;
                })
                // Divide each ingredient in R by total of all ingredients for recipe
                forEach(tempRow, (value: number, index: number) => {
                    tempRow[index] = value / rowSum;
                });
                R.push(tempRow);
                rSigma.push(tempRowSigma);
            }
        });

        // Build the N matrix
        let N: number[][] = [];
        let tempIngredientSetPlaintext: string[] = [];
        forOwn(Array.from(ingredientSet), (value: string) => {
            let f = Number(get(this.state.ingredients[value], "f")) / this.state.nDivisor;
            let c = Number(get(this.state.ingredients[value], "c")) / this.state.nDivisor;
            let p = Number(get(this.state.ingredients[value], "p")) / this.state.nDivisor;
            N.push([f,c,p]);
            tempIngredientSetPlaintext.push(startCase(value));
        });

        // Set state
        this.setState({
            recipePlaintext: activeRecipeNamePlaintext,
            ingredientPlaintext: tempIngredientSetPlaintext,
            nutrientPlaintext: ["Fats", "Carbs", "Protein"], // Hardcoding for now since no one owns this yet
        });
        let queryStr: string = JSON.stringify({
                "tag" : "demo day! test run.",
                "algorithm" : algo,
                "num_iterations" : 3000,
                "num_seconds" : 0.9,
                "W" : W, 
                "R" : R,
                "Rsigma" : rSigma,
                "N" : N,
                "T" : T,
                "A": A
            });
        this.setState({queryString: queryStr});

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: queryStr
        })
        .then((response) => { return response.text(); })
        .then((response) => {
            let data = JSON.parse(response);
            this.setState({results: extend(this.state.results, {m: data.M, r: data.R, n:N, t:T})});
            this.setState({queryResult: response});
            this.setState({isLoading: false});
        })
        .catch((error) => {
            console.error(error);
        });
    }
}