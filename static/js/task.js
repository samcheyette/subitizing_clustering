
/*

IDEA: Give people dot arrays using 1...N colors 
(where the number of colors C is manipulated). 
Have people estimate how many dots of one of the colors they saw.
Even in conditions where C colors are used, sometimes only show people
arrays with 1...(C-1) colors. D

 */



/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded

// Stimuli for a basic Stroop experiment


//var wait_for_digits = true;
var TRIAL_ID = 0;
var PID = Math.round(Math.random()*1000000);
var GRID_X = 8;
var GRID_Y = 15;
var NOISE_MASK = false;
var BREAK_EVERY = 10;
var PAD = 5;
var DOT_SIZE = 60;
GRID_X = GRID_X + PAD*2;
GRID_Y = GRID_Y + PAD*2;


/////////

var NUMS = [1,2,3,4,5,6,7,8];
var TOTAL_TRIALS = 20;
var EXP_DURATION = 400;
var MULT = 1;
var CLUSTER = true;
var CLUSTER_DIST_X = 75;
var CLUSTER_DIST_Y = 0;

var P_SUB1 = 0.5;


var pages = [
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	///"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
UTILS */

function shuffle_array(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var contains = function(a, obj) {
	//console.log(a);
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}



var pick_N = function(upto) {
	var i = 0;
	var choose = [];
	var N = Math.round(Math.random() * (max_N - min_N) + min_N);
	while (choose.length < N) {
		rand = Math.floor(Math.random() * upto);
		if (!contains(choose,rand)) {
			choose[choose.length] = rand;
		}
	}
	return(choose);

}



var count_N = function(arr, elem) {
	var count = 0;
	for(var i = 0; i < arr.length; i++){
	    if(arr[i] == elem) {

	        count++;
	    }
	}
	return(count);


};


var unique_elements = function(arr) {
	var uniq=[];
	for (i=0; i<arr.length; i++) {
		var item = arr[i];
		if (!contains(uniq, item)) {
			uniq[uniq.length] = item;
		}
	}
 return (uniq);

};

var make_grid = function(w,h,n_w,n_h,pd) {
	var grid = [];
	for (var x = 1+pd; x < n_w-pd; x++) {
		var x_coord = (w*x)/n_w;
		for (var y = 1+pd; y < n_h-pd; y++) {
			var y_coord = (h*y)/n_h;
			var pos = {"x":x_coord, "y":y_coord}
			grid[grid.length] = pos;
		}

	}
	return(grid);

};



/*******************
UTILS*/





/****************
* Experiment *
****************/


var SubitizingExp = function() {

	var draw = function(stims, size, color,shape) {
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		ctx.fillStyle=color;

	 	var font_size = size + "px Times";
		ctx.font = font_size;

		var l = stims.length;
		for (s=0; s<l; s++) {
			var pos_x = stims[s].x;
			var pos_y = stims[s].y;
			if (shape == "rect") {
				ctx.fillRect(pos_x, pos_y,size/2,size/2);

			} else {
				ctx.fillText(".", pos_x, pos_y);

			}

		}

	};


	var clear_stimulus = function() {
		var canvas = document.getElementById('canvas');

		var w = canvas.width;
		var h = canvas.height;

		var ctx = canvas.getContext("2d");
 		ctx.clearRect(0, 0, w, h);
	};

	var wait_for_response = function() {
		var canvas = document.getElementById('canvas');
		var w = canvas.width;
		var h = canvas.height;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle="black";
	 	ctx.clearRect(0, 0, w, h);
		ctx.font = "22px Times";
		ctx.fillText("Estimate the number of dots.", w/4,h/2)

	};



	var chill = function() {
		var canvas = document.getElementById('canvas');
		var w = canvas.width;
		var h = canvas.height;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle="black";
	 	ctx.clearRect(0, 0, w, h);
		ctx.font = "30px Times";
		ctx.fillText("Section complete.", w/3,h/2)
		ctx.fillText("Press enter to continue.", w/4,h/2+30)

	}

	var show_feedback = function(g, t) {
		var w = canvas.width;
		var h = canvas.height;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle="black";
	 	ctx.clearRect(0, 0, w, h);
		ctx.font = "40px Times";

	 	if (g == t) {
	 		var write = "Correct!";
	 		ctx.fillText(write, 4*w/9,h/2);


	 	} else {
	 		var write = "Incorrect! (" + t + ")";
	 		ctx.fillText(write, 3*w/9,h/2);

	 	}

	};


	var make_stimulus_locs = function(N) { 
				//makes stimuli locations at
				//about all radii



			var stimuli_locs = [];
			var canvas = document.getElementById('canvas');

			var w = canvas.width;
			var h = canvas.height;
			
			grid = shuffle_array(grid);

			var grid_N = grid.slice(0,N);

			if (CLUSTER) {
				var U = N;
				if (Math.random() < P_SUB1) {
					U = U - 1;
				}
				for (i=0; i < U; i++) {
					var p = grid_N[i];
					//var d_x = CLUSTER_DIST * (0.5 - Math.random());
					//var d_y = CLUSTER_DIST * (0.5 - Math.random());
					//d_x = Math.max(-30, Math.min(30, d_x));
					//d_y = Math.max(-30, Math.min(30, d_y));
					var d_x = Math.max(CLUSTER_DIST_X * Math.random(), CLUSTER_DIST_X/2);
					var d_y = Math.max(CLUSTER_DIST_Y * Math.random(), CLUSTER_DIST_Y/2);
					if (Math.random() < 0.5) {
						d_x = -d_x;
					}

					var x_coord = p.x + d_x;
					var y_coord = p.y + d_y;
					grid_N[grid_N.length] = {"x":x_coord, "y":y_coord};
				}
			}



			return grid_N;

	};

	var next = function() {
		clear_stimulus();
		n_prop = NUMS[Math.floor(Math.random() * NUMS.length)];
		if (CLUSTER) {
			n_prop = Math.floor((n_prop+1)/2);
		}
		current_stimulus = make_stimulus_locs(n_prop*MULT);
		n_shown = current_stimulus.length;
		draw(current_stimulus, DOT_SIZE, "blue", "dot");



		var ready = function() {

			clear_stimulus();

			var proceed = function() {
				listening = true;
				clear_stimulus();
				wait_for_response();

				rt = new Date().getTime();

			}

			if (NOISE_MASK) {
				draw(make_stimulus_locs(70), 30, "black", "rect");
				draw(make_stimulus_locs(70), 50, "black", "dot");
				draw(make_stimulus_locs(60), 30, "gray", "rect");
				draw(make_stimulus_locs(90), 80, "gray", "dot");

				setTimeout(proceed, 75);

			} else {
				proceed();
			}


		};

		setTimeout(ready, EXP_DURATION);

	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	var response_handler = function(e) {

		if (!listening) return;

		var keyCode = e.keyCode,
			response;


		var value = String.fromCharCode(e.keyCode);
		var parsed = parseInt(value, 10);


		var handle_next = function() {




				for (k=0;k<current_stimulus.length;k++) {

					psiTurk.recordTrialData({'phase':"TEST",
										 'trial_id':TRIAL_ID,
										 'mult':MULT,

										 'loc_x':current_stimulus[k].x,
										 'loc_y':current_stimulus[k].y,
										 'n_shown': n_shown * MULT,
										 'guess': parsed * MULT
										})
				}

				TRIAL_ID = TRIAL_ID + 1;

				if (TRIAL_ID >= TOTAL_TRIALS) {
					finish();
				} else if (TRIAL_ID % BREAK_EVERY == 0) {
					chilling = true;
					listening = true;

					chill();

				} else {
					setTimeout(next, 200);

				}

			
		};

		if (!isNaN(parsed) && (!chilling)) {
			listening = false;
			show_feedback(parsed*MULT, n_shown*MULT);
			setTimeout(handle_next, 500);

		} else if ((keyCode == 13) && chilling) {
			listening = false;
			chilling = false;
			setTimeout(clear_stimulus, 50);
			setTimeout(next, 250);		

		}


	};

	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	$("body").focus().keydown(response_handler); 

	// Start the test

	var canvas = document.getElementById('canvas');
	var grid = make_grid(canvas.width,canvas.height,GRID_X,GRID_Y,PAD);

	var rt = -1;
	var n_shown = -1;

	var listening = false;
	var chilling = false;
	var locs = [];
	next();

}
/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
               // psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
               // }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new SubitizingExp(); } // what you want to do when you are done with instructions
    );
});
