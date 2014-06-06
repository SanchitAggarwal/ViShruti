// Adding joystick Controls
var PI = 180.0;
var verticleAngle=20,horizontalAngle=30,diagonalAngle=40;

var Quadrants = {
	East_Max : horizontalAngle,
	East_Min : 2*PI-horizontalAngle,
	NorthEast_Min : horizontalAngle,
	NorthEast_Max : horizontalAngle + diagonalAngle,
	North_Min : PI/2 - verticleAngle,
	North_Max : PI/2 + verticleAngle,
	NorthWest_Min : PI/2 + verticleAngle,
	NorthWest_Max : PI - horizontalAngle,
	West_Min : PI - horizontalAngle,
	West_Max : PI + horizontalAngle,
	SouthWest_Min : PI + horizontalAngle,
	SouthWest_Max : PI + horizontalAngle + diagonalAngle,
	South_Min : PI/2 + PI - verticleAngle,
	South_Max : PI/2 + PI + verticleAngle,
	SouthEast_Min : PI/2 + PI + verticleAngle,
	SouthEast_Max : 2*PI - horizontalAngle
}
var DirectionIndex = {
	NorthWest : 0,
	North : 1,
	NorthEast : 2,
	West : 3,
	Center :4,
	East : 5,
	SouthWest : 6,
	South: 7,
	SouthEast : 8,
	NextTrial: 9
}
var DirectionLabels = ['NW',' N','NE',' W',' C',' E','SW',' S','SE','Space'];
var joyStickLabels = [11,21,31,12,22,32,13,23,33,50];  // (10 * (x+2)) + (y+2)
var joyStick, joyStickDetected = false,oldJoyStick,jsResponseValue = [];
var Buttons = {
												FACE_1: 0,
												FACE_2: 1,
												FACE_3: 2,
												FACE_4: 3,
												LEFT_SHOULDER: 4,
												RIGHT_SHOULDER: 5,
												LEFT_SHOULDER_BOTTOM: 6,
												RIGHT_SHOULDER_BOTTOM: 7,
												SELECT: 8,
												START: 9,
												LEFT_ANALOGUE_STICK: 10,
												RIGHT_ANALOGUE_STICK: 11,
												PAD_UP: 12,
												PAD_DOWN: 13,
												PAD_LEFT: 14,
												PAD_RIGHT: 15,
												CENTER_BUTTON: 16
											};
var Axes = {
											LEFT_X: 0,
											LEFT_Y: 1,
											RIGHT_X: 2,
											RIGHT_Y: 3
										};
var ANALOGUE_BUTTON_THRESHOLD = .5;
var AXIS_DEADZONE = 0.8;
var Axes_X,Axes_Y,oldAxes_X,oldAxes_Y,Theta,oldTheta,quad,oldquad;
document.onkeyup = onUserInput;

buttonPressed = function(stick, buttonId) {
	//console.log(stick.buttons[buttonId]);
	return stick.buttons[buttonId].pressed && (stick.buttons[buttonId].value > ANALOGUE_BUTTON_THRESHOLD);
};

stickDistanceMoved = function(x,y) {
	var distance = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	return  distance > AXIS_DEADZONE ? distance : 0;
};

function initJoyStick(){
	joyStick = navigator.getGamepads && navigator.getGamepads()[0];
	if(joyStick){
		console.log('in init joystick');
		joyStickDetected = true;
	}
}

function findIndex(search_array,key){
	var index = -1;
	for(var i =0;i<search_array.length;i++){
		if(search_array[i] == key){
			index = i;
			break;
		}
	}
	return index;
}

function getAngle(x,y){
	var angle;
	angle = 180*Math.atan2(y,x)/Math.PI;
	angle = angle < 0? Math.abs(angle):360 - angle
	return angle;
}

function getQuadrant(angle){
	if(angle > Quadrants.NorthEast_Min &&  angle <= Quadrants.NorthEast_Max){
		return DirectionIndex.NorthEast;
	}else if(angle > Quadrants.North_Min  &&  angle <= Quadrants.North_Max){
		return DirectionIndex.North;
	}else if(angle > Quadrants.NorthWest_Min  &&  angle <= Quadrants.NorthWest_Max){
		return DirectionIndex.NorthWest;
	}else if(angle > Quadrants.West_Min &&  angle <= Quadrants.West_Max){
		return DirectionIndex.West;
	}else if(angle > Quadrants.SouthWest_Min  &&  angle <= Quadrants.SouthWest_Max){
		return DirectionIndex.SouthWest;
	}else if(angle > Quadrants.South_Min  &&  angle <= Quadrants.South_Max){
		return DirectionIndex.South;
	}else if(angle > Quadrants.SouthEast_Min  &&  angle <= Quadrants.SouthEast_Max){
		return DirectionIndex.SouthEast;
	}else{
		return DirectionIndex.East;
	}
}

function onUserInput() {
	if(USERCONTROL == 'JoyStick'){
		joyStickResponse();
	}
	else{
		KeyBoardResponse();
	}
}

function joyStickResponse(){
	if (!joyStickDetected) {
		initJoyStick();
	} else {
		oldJoyStick = JSON.parse(JSON.stringify(joyStick));
		joyStick = navigator.getGamepads && navigator.getGamepads()[0];
		Axes_X = joyStick.axes[Axes.LEFT_X];
		Axes_Y = joyStick.axes[Axes.LEFT_Y];
		oldAxes_X = oldJoyStick.axes[Axes.LEFT_X];
		oldAxes_Y = oldJoyStick.axes[Axes.LEFT_Y];
		Theta = getAngle(Axes_X,Axes_Y);
		oldTheta = getAngle(oldAxes_X,oldAxes_Y);
		quad = getQuadrant(Theta);

		if(buttonPressed(oldJoyStick,Buttons.FACE_1)!=buttonPressed(joyStick,Buttons.FACE_1) && !buttonPressed(joyStick,Buttons.FACE_1)){
			console.log("Key Pressed, Play Next Trial");
			playNextTrial();
			jsResponseValue =[];
			oldquad = DirectionIndex.Center;
		}
		if(stickDistanceMoved(Axes_X,Axes_Y) && quad != oldquad){
			oldquad = quad;
			console.log(Theta);
			console.log("Response Recorded: ")
			jsResponseValue.push(DirectionLabels[quad]);
			jsResponseValue.push(Theta);

		}
		if(!stickDistanceMoved(Axes_X,Axes_Y)){
			oldquad = DirectionIndex.Center;
		}
	}
}

function playNextTrial(){
	console.log(jsResponseValue);
//	NextCue();
//	playSounds();
//	CueTime =  new Date().getTime();
}

//globalID = requestAnimationFrame(joyStickResponse);

function KeyBoardResponse(){
	var waitTime = new Date().getTime();
	if(!Sounds[counter] && counter>0){
		StartExp = true;
	}
	if(StartExp && !ExperimentEnd){
		//var key_press = String.fromCharCode(event.keyCode);
		var key_code = event.keyCode;
		var key_index_a = findIndex(inputDirection_a,key_code);
		var key_index_b = findIndex(inputDirection_b,key_code);
		if(key_index_a == -1 && key_index_b == -1){
			console.log('Invalid Input');
		}
		else{
			if(key_index_a == 9 ||key_index_b==9){
				console.log('Spacebar: next '+next+' CurrentCuePos '+CurrentCuePos+" TotalStimuli:"+TotalStimuli);
				while(next<CurrentCuePos){
					var x =  Path[next][0];
					var y = Path[next][1];
					var cue_x = Cue[next][0];
					var cue_y = Cue[next][1]*-1;
					var cue_code = 10 * (cue_x + 2) + (cue_y + 2);
					var cue_index = findIndex(expectedDirection,cue_code);
					CueLabels.push(DirectionLabels[cue_index]);
					InputLabels.push('NoInput');
					if(VisualError){Maze[x][y] = 4 * (CueNo % 2) + 4;}
					Miss++;
					count--;
					next++;
				}
				// Add marker in input and cue labels
				CueLabels.push(DirectionLabels[key_index_a]);
				InputLabels.push(DirectionLabels[key_index_a]);
				if(count==TrialLength){Recall++;}
				InputTime.push(IntervalTime);
				ResponseTime = ResponseTime + IntervalTime;
				IntervalTime = 0;
				count=0;
				next = CurrentCuePos;
				if(CurrentCuePos==TotalStimuli && PopNextFunction == 0){ // pop next function for new Maps
					if(Staircase){
						FamiliarRecall = Recall;
						FamiliarISI = FamiliarRecall>=maxRecall?ISIList[ISICounter-1]:FamiliarISI;
						maxRecall =  FamiliarRecall>=maxRecall?FamiliarRecall:maxRecall;
					}
					drawMaze(Maze,MazeLength);
					drawMetrics();
					if(CurrentMode == 'InCorrectVisualCue'){
						drawCorrectMaze(MazeLength,Path);
					}
					var canvas = document.getElementById('Maze_Canvas');
					var savecanvas = document.createElement('a');
					savecanvas.href = canvas.toDataURL('image/png').replace('image/png');
					savecanvas.download= USERID + "_" + CurrentMode + "_Dir_" + Direction + "_Map_" + CurrentMapNo +"_PL_" + TotalStimuli + "_FI_" + FileIndex + ".png";
					document.body.appendChild(savecanvas);
					savecanvas.click();

					if(WM){
						TrialLength = WM_CueLength.toString();
					}
					if(Staircase){
						TrialLength = StaircaseCueLength.toString();
					}
					var currentAccuracy = 100*Hit/(TotalStimuli);
					AvgAccuracy = ((CurrentMapNo - 1)*AvgAccuracy + currentAccuracy)/CurrentMapNo;
					console.log(AvgAccuracy);
					ExperimentResults.push([FileIndex,Direction,TrialLength,CurrentMode,AccuracyThreshold,TotalStimuli,Hit,Miss,100*Hit/(TotalStimuli),Recall,ResponseTime,ResponseTime/TotalStimuli,NoOfMaps,InputTime.toString(),CueLabels.toString(),InputLabels.toString(),InterStimulusInterval,AvgAccuracy]);
					var KeyExp = ExperimentList[CurrentMode];
					console.log('Accuracy Flag :'+AccuracyFlag);
					if(CurrentMapNo>5 && KeyExp < 5){
						if(currentAccuracy >= AccuracyThreshold){
							AccuracyFlag = AccuracyFlag -1;
						}
						else{
							AccuracyFlag = 3;
						}
					}
					else{
						AccuracyFlag = 3;
					}
					if(AccuracyFlag <= 0){
						console.log("Accuracy for three consecutive map is greater than threshold ,switching to another mode");
						var i = CurrentMapNo;
						while(i<NMaps){
							FQCounter--;
							FileIndex++;
							FunctionQueue.shift();
							console.log("Spliced the function call");
							i++;
						}
					}
					else{
						if(CurrentMapNo==NoOfMaps && KeyExp < 5){
							ExperimentEnd = 1;
							// clear the polling variable
							alert('Avg Accuracy of three consecutive Maps less than Accuracy Threshold '+ AccuracyThreshold +' After '+NMaps + ' Maps.\nTerminating Experiment');
							while(i<NMaps){
								FQCounter--;
								FileIndex++;
								FunctionQueue.shift();
								console.log("Spliced the function call");
								i++;
							}
							clearInterval(checkFunctionQueue);
							stopExperiment();
						}
					}

					next = 0;
					Hit = 0;
					Miss = 0;
					ResponseTime = 0;
					CurrentCuePos = 0;
					count=0;Recall=0;
					CueNo = 0;
					PopNextFunction = 1;
				}
				else{ //play next cues
					// inter-trial time between two sound patterns in working memory experiment
					startexp = false;
					var str1 = "./Silence/silence";
					silencefile = str1.concat(InterTrialInterval,'.wav');
					AddSilence();
					// play next audio sequence
					NextCue();
					playSounds();
					CueTime =  new Date().getTime();
				}
				drawMaze(Maze,MazeLength);
				drawMetrics();
				drawControls(key_index_a);
			}
			else{
				var x, y,cue_x,cue_y,cue_index;
				var noextra = true;
				if(next < CurrentCuePos){
					x =  Path[next][0];
					y = Path[next][1];
					cue_x = Cue[next][0];
					cue_y = Cue[next][1]*-1;
					cue_code = 10 * (cue_x + 2) + (cue_y + 2);
					cue_index = findIndex(expectedDirection,cue_code);
					CueLabels.push(DirectionLabels[cue_index]);
				}
				else{
					noextra = false;
					cue_index = -2;
					CueLabels.push('NoCues');
				}
				var input_index = key_index_a > key_index_b ? key_index_a:key_index_b;
				InputLabels.push(DirectionLabels[input_index]);
				if(key_index_a == cue_index || key_index_b == cue_index){
					IntervalTime = IntervalTime + (waitTime - CueTime )/1000;
					CueTime = new Date().getTime();
					count++;
					Hit++;
					if(VisualError && noextra){Maze[x][y] = 4 * (CueNo % 2) + 3;}
				}
				else{
					IntervalTime = IntervalTime + (waitTime - CueTime)/1000;
					CueTime = new Date().getTime();
					if(AudioError){playError();}
					Miss++;
					count--;
					if(VisualError && noextra){Maze[x][y] = 4 * (CueNo % 2) + 4;}
				}
				drawMaze(Maze,MazeLength);
				drawMetrics();
				drawControls(key_index_a>key_index_b?key_index_a:key_index_b);
				next++;
			}
		}
	}
}



//$("#StartExp").on("click", function() {
//});
//
//$("#StopExp").on("click", function() {
//	if(USERCONTROL == 'JoyStick')
//		cancelAnimationFrame(globalID);
//});


//function joyStickResponse(){
//	if (!joyStickDetected) {
//		initJoyStick();
//	} else {
//		oldJoyStick = JSON.parse(JSON.stringify(joyStick));
//		joyStick = navigator.getGamepads && navigator.getGamepads()[0];
//		if(buttonPressed(oldJoyStick,Buttons.FACE_1)!=buttonPressed(joyStick,Buttons.FACE_1) && !buttonPressed(joyStick,Buttons.FACE_1)){
//			//prevJsResponseValue = (10 * (stickMoved(oldJoyStick,Axes.LEFT_X)+2))+stickMoved(oldJoyStick,Axes.LEFT_Y)+2;
////			jsResponseValue = joyStickLabels[9];
//			console.log("Key Pressed, Play Next Trial");
//			playNextTrial();
//			jsResponseValue =[];
//		}
////		else if((stickMoved(joyStick,Axes.LEFT_X) != stickMoved(oldJoyStick,Axes.LEFT_X) || stickMoved(joyStick,Axes.LEFT_Y) != stickMoved(oldJoyStick,Axes.LEFT_Y))
////			&& (stickMoved(joyStick,Axes.LEFT_X) || stickMoved(joyStick,Axes.LEFT_Y))){
////			Axes_X = stickMoved(joyStick,Axes.LEFT_X);
////			Axes_Y = stickMoved(joyStick,Axes.LEFT_Y);
////			//prevJsResponseValue = (10 * (stickMoved(oldJoyStick,Axes.LEFT_X)+2))+stickMoved(oldJoyStick,Axes.LEFT_Y)+2;
////			jsResponseValue.push(DirectionLabels[findIndex(joyStickLabels,(10 * (Axes_X+2))+Axes_Y+2)]);
////			console.log("Stick Moved: " + Axes_X + "__" + Axes_Y);
//////			if(prevJsResponseValue == 0){
//////				playNextTrial(jsResponseValue);
//////			}
////		}
////		else{
////			console.log('Waiting for response');
////		}
//		else{
//
//			Axes_X = stickMoved(joyStick,Axes.LEFT_X);
//			Axes_Y = stickMoved(joyStick,Axes.LEFT_Y);
//			oldAxes_X = stickMoved(oldJoyStick,Axes.LEFT_X);
//			oldAxes_Y = stickMoved(oldJoyStick,Axes.LEFT_Y);
//			Theta = getAngle(Axes_X,Axes_Y);
//			oldTheta = getAngle(oldAxes_X,oldAxes_Y);
//			if(getDirection(Theta) != getDirection(oldTheta) && getDirection(Theta)!=DirectionSet.Center){
//				console.log(Theta);
//				jsResponseValue.push(DirectionLabels[getDirection(Theta)]);
//			}
//		}
//
//	}
//}


var inputDirection_a = [36,38,33,37,12,39,35,40,34,32];   //added 32 for spacebar
var inputDirection_b = [103,104,105,100,101,102,97,98,99,32]; //added 32 for spacebar
var expectedDirection = [13,23,33,12,22,32,11,21,31];