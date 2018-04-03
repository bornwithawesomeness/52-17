import React from 'react'
import {
  Grid, Row, Col, FormGroup, FormControl, ControlLabel,
   Button, Checkbox
} from 'react-bootstrap'
import _ from 'lodash'
import FieldGroup from './fieldgroup'

export default class SettingsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRadio: this.props.isRadio,
      radioStation: null
    }
  }

  saveChanges = () => {
    this.props.setTimeValues(this.props.minutesWorking,this.props.minutesBreak);
    this.props.changeAlarmRadio(this.state.isRadio);
    this.props.setRadioStation(this.state.radioStation);
    this.props.handleMenuClick();
    this.props.stopTimer('work');
    this.props.stopTimer('break');
  }

  onCheckboxClick = () => {
    this.setState({
      isRadio: !this.radioCheckbox.props.checked
    })
  }

  selectRadioStation = (e) => {
    let radioStation = e.target.value;
    this.setState({
      radioStation
    })
  }

  render() {
    return (
      <nav className="menu-side">
        <FieldGroup
          id="minutesWorking"
          label="Minutes Working"
          type="number"
          icon="wrench"
          placeholder="Enter Minutes"
          value={this.props.minutesWorking}
          onChange={this.props.workMinutesChange}
        />
        <FieldGroup
          id="breakMinutes"
          label="Minutes Break"
          type="number"
          icon="bell"
          placeholder="Enter Minutes"
          value={this.props.minutesBreak}
          onChange={this.props.breakMinutesChange}
        />
        {
          this.props.hasNet?(
            <FieldGroup
              id="useRadio"
              customField={
                <Checkbox checked={this.state.isRadio} onChange={this.onCheckboxClick} ref={(ref)=>{this.radioCheckbox = ref;}}>Use Radio for alarm</Checkbox>
              }
            />
          ):null
        }

        {
          this.state.isRadio?(
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Select Radio Station</ControlLabel>
              <FormControl componentClass="select" placeholder="select" onChange={this.selectRadioStation}>
              {
                _.map(this.props.radioStations, (radio)=>{
                  return (
                    <option value={radio.idx} key={radio.idx}>{radio.name}</option>
                  )
                })
              }
              </FormControl>
            </FormGroup>
          ):null
        }

        <Button bsStyle="danger" className="pull-right" onClick={this.saveChanges}>Save</Button>
      </nav>
    );
  }
}
