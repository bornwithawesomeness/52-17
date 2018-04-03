import React from 'react';
import {
      Grid,
      Row,
      Col,
      Well,
      Form,
      FormControl,
      Button,
      FormGroup,
      InputGroup,
      HelpBlock,
      ControlLabel

} from 'react-bootstrap'

import {Icon} from 'react-fa'

export default  class FieldGroup extends React.Component{
	constructor(props){
		super(props);
    this.state={
      value:'',
      isValid:'error'
    }
	}

	render(){
    const {id,label,type,icon,placeholder,value} = this.props;
		return(
        <FormGroup controlId={id}  bsSize="lg">
          <ControlLabel>{label}</ControlLabel>
              {
                this.props.customField?(
                  this.props.customField
                ):(
                  <InputGroup>
                    <InputGroup.Addon>
                      <Icon name={icon} />
                    </InputGroup.Addon>
                    <FormControl  bsClass="form-control"  type={type} placeholder={placeholder}
                      value={value || ''}
                      onChange={this.props.onChange}
                      disabled={this.props.disabled || false}
                     />
                 </InputGroup>
                )
              }
        </FormGroup>

			);
	}
}
