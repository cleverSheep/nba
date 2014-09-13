var Promise = require( "./promise" );

var getJSON = require( "./get-json" );
var maps = require( "./maps" );
var util = require( "./util" );

var api = require( "./api" );

var TWO_WORD_TEAMS = {
  "Portland Trail Blazers": true
};

// adds location and short name data to team objects.
function addExtraTeamData ( team ) {
  team.teamName = team.teamName.trim();
  var splitted = team.teamName.split( " " );
  if ( TWO_WORD_TEAMS[ team.teamName ] ) {
    team.simpleName = splitted.splice( -2, 2 ).join( " " );
  } else {
    team.simpleName = splitted.splice( -1, 1 ).join();
  }
  team.location = splitted.join( " " );
  return team;
}

module.exports = function () {
  var statReq = api.teamStats();
  var infoReq = api.teamYears();
  return Promise.all([ statReq, infoReq ]).then( function ( responses ) {
    return util.pickKeys( util.mergeCollections( "teamId", responses ),
      "teamId", "abbreviation", "teamName" )
    .map( addExtraTeamData );
  });
};