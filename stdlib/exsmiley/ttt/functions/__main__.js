const lib = require('lib')({token: process.env.STDLIB_TOKEN});
let marked = ['~', '~', '~', '~', '~', '~', '~', '~', '~'];
let gameOver = false;
let lastTeam = Math.round(Math.random());

function markedToBoard(marked) {
	let marked2 = [];
	for(m of marked) {
		if(m == 0) {
			marked2.push('R');
		} else if(m == 1) {
			marked2.push('B');
		} else {
			marked2.push('~');
		}
	}
	return `|${marked2[0]}${marked2[1]}${marked2[2]}|\n|${marked2[3]}${marked2[4]}${marked2[5]}|\n|${marked2[6]}${marked2[7]}${marked2[8]}|\n`
}

// returns false if there is still an empty location or a team won
function isTie(marked, gameOver) {
	if(gameOver) {
		return false;
	} else {
		let tie = true;
		for(let i = 0; i < marked.length; i++) {
			if(marked[i] == '~') {
				tie = false;
			}
		}
		return tie;
	}
}

/**
* The tic tac toe game
* @param {integer} team What token is placed for that team
* @param {integer} loc Where the token is placed
* @param {boolean} reset if the game should be reset
* @returns {object} {text: str, success: bool}
*/
module.exports = (team, loc, reset=false, context, callback) => {
	if(reset && gameOver) {
		lastTeam = Math.round(Math.random());
		gameOver = false;
		marked = ['~', '~', '~', '~', '~', '~', '~', '~', '~'];
		let color = 'Red';
	    if(lastTeam == 0) {
	      color = 'Blue';
	    }
	    lib.exsmiley.tracker['@dev']({post: true, store: {'name': 'ttt', 'info': marked}}, function (err, result) {
			callback(null, {text: `Successfully Reset! It is ${color}'s turn!`, success: true});
		});
	} else if(gameOver) {
		callback(null, {text: 'Game already over\n' + markedToBoard(marked), success: false})
	} else if(reset) {
		callback(null, {text: "Can't reset: game not over\n" + markedToBoard(marked), success: false})
	} else if(lastTeam == team) {
		let color = 'Red';
	    if(team != 0) {
	      color = 'Blue';
	    }
		callback(null, {text: `It is not ${color}'s turn.`, success: false})
	} else if (marked[loc-1] != '~'){
		callback(null, {text: `Location ${loc} already marked!\n` + markedToBoard(marked), success: false});
	} else {
		marked[loc-1] = team;
		lastTeam = team;

		marked[0] == marked[1] && marked[1] == marked[2] && marked[1] != '~' ? gameOver = true: "N/A";
		marked[3] == marked[4] && marked[4] == marked[5] && marked[4] != '~' ? gameOver = true: "N/A";
		marked[6] == marked[7] && marked[7] == marked[8] && marked[7] != '~' ? gameOver = true: "N/A";

		marked[0] == marked[3] && marked[3] == marked[6] && marked[3] != '~' ? gameOver = true: "N/A";
		marked[1] == marked[4] && marked[4] == marked[7] && marked[4] != '~' ? gameOver = true: "N/A";
		marked[2] == marked[5] && marked[5] == marked[8] && marked[5] != '~' ? gameOver = true: "N/A";

		marked[0] == marked[4] && marked[4] == marked[8] && marked[4] != '~' ? gameOver = true: "N/A";
		marked[2] == marked[4] && marked[4] == marked[6] && marked[4] != '~' ? gameOver = true: "N/A";

		let color = 'Red';
	    if(team != 0) {
	      color = 'Blue';
	    }

	    let text = ` played at location: ${loc}\n` + markedToBoard(marked);
	    if(gameOver) {
	    	text += `${color} won the game!`
	    }

	    if(isTie(marked, gameOver)) {
	    	gameOver = true;
	    	text += 'Tie game!'
	    }

	    lib.exsmiley.tracker['@dev']({post: true, store: {'name': 'ttt', 'info': marked}}, function (err, result) {
			callback(null, {text: text, success: true});
		});
	}
};
