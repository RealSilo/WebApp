import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default class EditAddressPopover extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
    onEnterAddressClick: PropTypes.func.isRequired,
    ballot_location_chosen: PropTypes.bool.isRequired,
    ballot_location_display_name: PropTypes.string,
    election_day_text: PropTypes.string,
    election_is_upcoming: PropTypes.bool.isRequired,
    google_civic_data_exists: PropTypes.bool.isRequired,
    voter_entered_address: PropTypes.bool.isRequired,
    voter_specific_ballot_from_google_civic: PropTypes.bool.isRequired,
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      ballot_location_chosen: false,
      ballot_location_display_name: "",
      election_day_text: "",
      election_is_upcoming: false,
      google_civic_data_exists: false,
      show_ballot_status: true,
      voter_entered_address: false,
      voter_specific_ballot_from_google_civic: false,
    };
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount () {
    // console.log("In EditAddressPopover componentDidMount");
    this.setState({
      ballot_location_chosen: this.props.ballot_location_chosen,
      ballot_location_display_name: this.props.ballot_location_display_name,
      election_day_text: this.props.election_day_text,
      election_is_upcoming: this.props.election_is_upcoming,
      google_civic_data_exists: this.props.google_civic_data_exists,
      show_ballot_status: true,
      voter_entered_address: this.props.voter_entered_address,
      voter_specific_ballot_from_google_civic: this.props.voter_specific_ballot_from_google_civic,
    });
  }
  componentWillReceiveProps (nextProps) {
    // console.log("EditAddressPopover componentWillReceiveProps");
    this.setState({
      ballot_location_chosen: nextProps.ballot_location_chosen,
      ballot_location_display_name: nextProps.ballot_location_display_name,
      election_day_text: nextProps.election_day_text,
      election_is_upcoming: nextProps.election_is_upcoming,
      google_civic_data_exists: nextProps.google_civic_data_exists,
      show_ballot_status: true,
      voter_entered_address: nextProps.voter_entered_address,
      voter_specific_ballot_from_google_civic: nextProps.voter_specific_ballot_from_google_civic,
    });
  }

  closePopover () {
    this.refs.overlay.hide();
  }

  render () {
    let exclamation_circle_red = "#fc0d1b"; // I tried to replace literal string below with this variable. Didn't work.
    let message_title = "This is our best guess";
    let message_string = "";
    let address_popover_enter_address_on = true;

    // TODO DALE: Deal with the situation where you are in one state (ex "NC") and you link to a NY ballot
    // The EditAddressPopover message should update
    if (this.state.election_is_upcoming) {
      if (this.state.voter_specific_ballot_from_google_civic) {
        // message_string += ""; // No additional text
        // address_popover_enter_address_on = false;
        return null;
      } else if (this.state.voter_entered_address) {
        // message_title = "";
        // message_string += "We are showing you the closest match to your official ballot.";
        //address_popover_enter_address_on = false;
        return null;
     } else if (this.state.google_civic_data_exists) {
        message_string += "Want to make sure these are your ballot items? Enter the full address where you are registered to vote.";
        address_popover_enter_address_on = true;
      } else {
        message_string += "We are showing you the closest match to your official ballot.";
      }
    } else if (this.state.voter_specific_ballot_from_google_civic) {
      // message_string += "";
      // address_popover_enter_address_on = false;
      return null;
    } else if (this.state.voter_entered_address) {
      message_string += "We are showing you the closest match to your official ballot.";
      address_popover_enter_address_on = false;
    } else if (this.state.google_civic_data_exists) {
      message_string += "This election is in the past. We are showing you the closest match to your official ballot.";
      address_popover_enter_address_on = false;
    } else {
      message_string += "This election is in the past. We are showing you the closest match to your official ballot.";
      address_popover_enter_address_on = false;
    }


    const AddressPopover = <Popover id="popover-trigger-click-root-close" onClick={this.closePopover}>
      <div style={{textAlign: "center"}}>
        <p>
          <span style={{color: "#ef1e26"}}>{message_title}</span>
          {/* This is the "x" to close the popover */}
          <i className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" />
        </p>
        <p>{message_string}</p>
        { address_popover_enter_address_on ?
          <button className="btn btn-success" onClick={this.props.onEnterAddressClick}>Enter Address &gt;&gt;</button> :
          null
        }
      </div>
    </Popover>;

    return (
        <OverlayTrigger
          trigger="click"
          ref="overlay"
          onExit={this.closePopover}
          rootClose
          placement={this.props.placement}
          overlay={AddressPopover}>
            <span>
              { this.props.address }
              <span className="position-rating__source with-popover">&nbsp;&nbsp;
              <i className="fa fa-exclamation-circle" aria-hidden="true" style={{color: "#fc0d1b"}} />&nbsp;&nbsp;</span>
            </span>
        </OverlayTrigger>
    );
  }
}
