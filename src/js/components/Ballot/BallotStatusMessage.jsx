import React, { PropTypes, Component } from "react";


export default class BallotStatusMessage extends Component {
  static propTypes = {
    ballot_location_chosen: PropTypes.bool.isRequired,
    ballot_location_display_name: PropTypes.string,
    election_day_text: PropTypes.string,
    election_is_upcoming: PropTypes.bool.isRequired,
    google_civic_data_exists: PropTypes.bool.isRequired,
    voter_entered_address: PropTypes.bool.isRequired,
    voter_specific_ballot_from_google_civic: PropTypes.bool.isRequired,
    toggleSelectBallotModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
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
  }

  componentDidMount () {
    // console.log("In BallotStatusMessage componentDidMount");
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
    // console.log("BallotStatusMessage componentWillReceiveProps");
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

  render () {
    // console.log("In BallotStatusMessage render");
    let message_string = "";
    let ballot_status_style;
    let see_other_elections = <span />;
    // this.state.google_civic_data_exists
    if (this.state.election_is_upcoming) {
      ballot_status_style = "alert-info";
      if (this.state.voter_specific_ballot_from_google_civic) {
        message_string += ""; // No additional text
      // } else if (this.state.voter_entered_address) {
      //   message_string += ""; // No additional text
      } else if (this.state.ballot_location_chosen && this.state.ballot_location_display_name) {
        message_string += "You are looking at the ballot for " + this.state.ballot_location_display_name + ". Some items below may not be on your official ballot.";
      } else {
        message_string += "This is a ballot near you. Some items below may not be on your official ballot.";
      }
    } else {
      ballot_status_style = ""; // "alert-danger";
      let message_in_past_string;
      if (this.state.election_day_text) {
        message_in_past_string = "This election was held on " + this.state.election_day_text + ".";
      } else {
        message_in_past_string = "This election has passed.";
      }
      if (this.props.toggleSelectBallotModal) {
        see_other_elections = <span onClick={this.props.toggleSelectBallotModal} > Click <img
          src={"/img/global/icons/gear-icon.png"}
          className="hidden-print" role="button"
          alt={"see other elections"}/> to see other elections.</span>;
      }
      if (this.state.voter_specific_ballot_from_google_civic) {
        message_string += message_in_past_string; // No additional text
      // } else if (this.state.voter_entered_address) {
      //   message_string += message_in_past_string; // No additional text
      //   message_string += see_other_elections;
      } else if (this.state.ballot_location_chosen && this.state.ballot_location_display_name) {
        message_string += message_in_past_string + " You are looking at the ballot for " + this.state.ballot_location_display_name + ". Some items shown below may not have been on your official ballot.";
      } else {
        message_string += message_in_past_string + " This was a ballot near you. Some items below may not have been on your official ballot.";
      }
    }

    if (this.state.show_ballot_status && message_string.length > 0) {
      return <div className="u-stack--sm">
        <div className={"alert " + ballot_status_style}>
          <a href="#" className="close" data-dismiss="alert">&times;</a>
          {message_string}
          {see_other_elections}
        </div>
      </div>;
    } else {
      return <div />;
    }
  }
}
