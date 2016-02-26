var Application = React.createClass({
  getInitialState() {
    var names = [
      "Ben",
      "Dan",
      "Eddie",
      "Euen",
      "Ian",
      "Jack",
      "Jefferson",
      "John",
      "Martin",
      "Nat",
      "Raphael",
      "Raymond",
      "Sam",
    ];
    var players = _.map(names, function(n) {
      return {
        name: n,
      }
    });
    return {
      players: players,
      games: []
    };
  },
  removePlayer(name) {
    var new_players = _.reject(this.state.players, function(p) {
      return p.name == name;
    });
    this.setState({ players: new_players });
  },
  addPlayer(e) {
    e.preventDefault();
    var name = this.refs.newName.value;
    var present = _.findWhere(this.state.players, { name: name });
    if (!present && name != "") {
      var new_players = _.union(this.state.players, [{ name: name }]);
      this.setState({ players: new_players });
    }
    return false;
  },
  render() {
    var _this = this;
    var panels = _.map(this.state.players, function(p, index) {
      return (
        <PlayerPanel name={ p.name }
                     key={ "player_" + index }
                     deleteCallback={ _this.removePlayer }/>
      );
    });
    var team = _.sample(this.state.players, 4);
    return(
      <div>
        { panels }
        <form onSubmit={ this.addPlayer }>
          <span>Add player </span>
          <input ref="newName" type='text'></input>
        </form>
        <TeamList name="Team 1" players={ team }/>
      </div>
    );
  }
});

var PlayerPanel = React.createClass({
  render() {
    var statusClass = classNames({
      'PlayerStatus': true,
      'active': this.props.status === "active",
      'first': this.props.status === "first",
      'absent': this.props.status === "absent",
    });
    return (
      <div className="PlayerPanel">
        <span>{ this.props.name }</span>
        { this.props.deleteCallback && <button onClick={ this.props.deleteCallback.bind(null, this.props.name) }>Remove</button> }
      </div>
    );
  }
});

var TeamList = React.createClass({
  render() {
    var players = _.map(this.props.players, function(p, index) {
      return (
        <PlayerPanel name={ p.name }
                     key={ "player_" + index }/>
      );
    });
    return (
      <div className="TeamList">
        <h4>{ this.props.name }</h4>
        { players }
      </div>
    );
  }
});

ReactDOM.render(
  <Application />,
  document.getElementById('container')
);
