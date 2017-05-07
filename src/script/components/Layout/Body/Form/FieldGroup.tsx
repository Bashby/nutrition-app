// Vendor libs
import * as React from "react";
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "react-bootstrap";

interface State {
    baseValue: string
}

interface Props {
    id: string,
    label: string,
    type: string,
    help?: string,
    placeholder?: string,
    validationStateResolver?: (value: string) => "success" | "warning" | "error" | undefined,
    onChangeHandler?: (e: React.FormEvent<any>) => void, // TODO: Fix the use of 'any' here
    elementValue?: string,
    validationMessages?: {
        error?: string,
        warning?: string,
        success?: string
    }
}

// Form FieldGroup
export class FieldGroup extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { baseValue: ""};
    }

    baseOnChangeHandler(e: React.FormEvent<any>) { this.setState({baseValue: e.currentTarget.value}); }

    render() {
        // Compute form element properties
        const elementValue = this.props.onChangeHandler && this.props.elementValue ? this.props.elementValue : this.state.baseValue
        const elementValidator = this.props.validationStateResolver ? this.props.validationStateResolver(elementValue): undefined
        const elementOnChangeHandler = this.props.onChangeHandler && this.props.elementValue ? this.props.onChangeHandler : this.baseOnChangeHandler.bind(this)
        
        // Compute help message, based on validation state
        let helpMessage;
        if (elementValidator) {
            switch(elementValidator) {
                case "error":
                    helpMessage = this.props.validationMessages && this.props.validationMessages.error
                        ? this.props.validationMessages.error
                        : "Invalid input detected.";
                    break;
                case "warning":
                    helpMessage = this.props.validationMessages && this.props.validationMessages.warning
                        ? this.props.validationMessages.warning
                        : "Possible invalid input detected.";
                    break;
                case "success":
                    if (this.props.validationMessages && this.props.validationMessages.success) {
                        helpMessage = this.props.validationMessages.success
                    } else if (this.props.help) {
                        helpMessage = this.props.help;
                    } else {
                        helpMessage = "\"" + elementValue + "\" is a valid input.";
                    }
                    break;
            }
        } else if (this.props.help) {
            helpMessage = this.props.help;
        }

        // Render form element
        return (
            <FormGroup
                controlId={this.props.id}
                validationState={elementValidator}
            >
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    value={elementValue}
                    onChange={elementOnChangeHandler}
                />
                <FormControl.Feedback />
                {helpMessage && <HelpBlock>{helpMessage}</HelpBlock>}
            </FormGroup>
        );
    }
}
