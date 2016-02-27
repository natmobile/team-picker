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
    ];
    var players = _.map(names, function(n) {
      return {
        name: n.toUpperCase(),
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
    var name = this.refs.newName.value.toUpperCase();
    var present = _.findWhere(this.state.players, { name: name });
    if (!present && name != "") {
      var new_players = _.union(this.state.players, [{ name: name }]);
      this.setState({ players: new_players });
    }
    return false;
  },
  generateMatchup() {
    var players = _.shuffle(this.state.players);
    players = _.sortBy(players, function(p) { return p.streak; });
    players = _.sortBy(players, function(p) { return p.plays; });
    players = players.slice(0,9);
    var team1 = _.sample(players, 4);
    var team2 = _.sample(_.difference(players, team1), 4);
    var sitting = _.difference(this.state.players, team1, team2);
    var games = this.state.games;
    games.push([team1, team2, sitting]);
    this.setState({ games: games });
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
    var games = _.map(this.state.games, function(g, index) {
      return <Game num={ index } teams={ g } />
    });
    var team = _.sample(this.state.players, 4);
    return(
      <div>
        <div classsName="Roster">
          <h3>ROSTER</h3>
          { panels }
          <form onSubmit={ this.addPlayer }>
            <span>ADD PLAYER </span>
            <input ref="newName" type='text'></input>
          </form>
        </div>
        { games }
        <span className="matchup" onClick={ this.generateMatchup }>NEXT MATCHUP</span>
      </div>
    );
  }
});

var PlayerPanel = React.createClass({
  renderStats() {
    if (!this.props.deleteCallback) return null;
    return (
      <span className="StatsWrapper">
        <span className="played">{ 4 }</span>
        <span className="sat">{ 1 }</span>
        <span className="streak">{ 2 }</span>
        <span className="spacer">0</span>
        <span className="remove" onClick={ this.props.deleteCallback.bind(null, this.props.name) }>X</span>
      </span>
    );
  },
  render() {
    var stats = this.props.deleteCallback;
    return (
      <div>
        <div className="PlayerPanel">
          <span className="name">{ this.props.name }</span>
          { this.renderStats() }
        </div>
      </div>
    );
  }
});

var Game = React.createClass({
  render() {
    console.log("rendering game");
    return (
      <div>
        <hr/>
        <h3>GAME { this.props.num }</h3>
        <TeamList name="HOME" players={ this.props.teams[0] }/>
        <TeamList name="AWAY" players={ this.props.teams[1] }/>
        <TeamList name="OUT" players={ this.props.teams[2] }/>
      </div>
    );
  }
});

var TeamList = React.createClass({
  render() {
    var players = _.map(this.props.players, function(p, index) {
      return <PlayerPanel name={ p.name }/>
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
