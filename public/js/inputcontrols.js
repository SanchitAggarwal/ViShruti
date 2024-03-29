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
var inputDirection_a = [36,38,33,37,12,39,35,40,34,32];   //added 32 for spacebar
var inputDirection_b = [103,104,105,100,101,102,97,98,99,32]; //added 32 for spacebar
var expectedDirection = [13,23,33,12,22,32,11,21,31];
var DirectionLabels = ['NW',' N','NE',' W',' C',' E','SW',' S','SE','Space'];
var joyStick, joyStickDetected = false,oldJoyStick;
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
var AXIS_DEADZONE = 0.9;
var Axes_X,Axes_Y,oldAxes_X,oldAxes_Y,Theta,oldTheta,quad,oldquad;
var KeyBoard = false;

buttonPressed = function(stick, buttonId) {
	//console.log(stick.buttons[buttonId]);
	return stick.buttons[buttonId].pressed && (stick.buttons[buttonId].value > ANALOGUE_BUTTON_THRESHOLD);
};

stickDistanceMoved = function(x,y) {
	var distance = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	return  distance > AXIS_DEADZONE ? distance : 0;
};

function initJoyStick(){
	console.log('Initializing joyStick');
	joyStick = navigator.getGamepads && navigator.getGamepads()[0];
	if(joyStick){
		console.log('joystick Detected');
		joyStickDetected = true;
	}
}
document.onkeyup = KeyBoardResponse;

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
	if(USERCONTROL == 'JoyStick' && joyStickDetected ){
		joyStickResponse();
	}
	else if(USERCONTROL == 'JoyStick' && !joyStickDetected){
		initJoyStick();
	}
	else{
		//console.log('KeyBoard Control');
		KeyBoard = true;

	}

}

// with continuous axis and FACE_1 for Next Trial
function joyStickResponse(){
	if(StartExp && !ExperimentEnd){
		console.log('Checking Joystick Response');
		//console.log(joyStick);
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
			//jsResponseValue =[];
			oldquad = DirectionIndex.Center;
		}
		if(stickDistanceMoved(Axes_X,Axes_Y) && quad != oldquad){
			InterResponseTime = (new Date().getTime() - waitTime)/1000;
			waitTime = new Date().getTime();
			oldquad = quad;
			console.log(Theta);
			console.log("Response Recorded: ");
			checkResponse(quad);
			//jsResponseValue.push(DirectionLabels[quad]);
			//jsResponseValue.push(Theta);

		}
		if(!stickDistanceMoved(Axes_X,Axes_Y)){
			oldquad = DirectionIndex.Center;
		}
	}
}

function playNextTrial(){
	if(next>0){
		isCompleteResponse();
		if(count==TrialLength){
			Recall = 1;
			TotalRecall++;
			if(Staircase){
				ISI_Recall[ISI_Index[InterStimulusInterval]]++;
			}
		}
		TimeStamp = new Date().toString();
		ExperimentData = [];
		ExperimentData.push(USERID,GROUPID,PHASENO,CurrentMode,Direction,FileIndex,CurrentMapNo,TrialNo,TrialLength,InterStimulusInterval);
		ExperimentData.push(TrialLabels.join(','),ResponseLabels.join(','),TrialTime,ResponseTime.join(','),TotalResponseTime,Hit,Miss,Recall,TrialLength*Recall,ExtraResponse.join(' '),TimeStamp);
		save(ExperimentData_Filename,ExperimentData);
		TrialLabels = [];
		ResponseLabels = [];
		ResponseTime = [];
		ExtraResponse = [' '];
		AverageResponseTime = ((next-1)*AverageResponseTime + TotalResponseTime)/next;
		TotalResponseTime = 0;
		Hit = 0;
		Miss = 0;
		Recall = 0;
	}
	count=0;
	next = CurrentCuePos;
	if(!isCompleteMap()){
		 //play next cues
		// inter-trial time between two sound patterns in working memory experiment
		StartExp = false;
		var str1 = "audio/silence_wav/silence";
		SilenceFile = str1.concat(InterTrialInterval,'.wav');
		AddSilence();
		// play next audio sequence
		NextCue();
		playSounds();
		TrialTime =  new Date().getTime();
	}
	drawMaze(Maze,MazeLength);
	drawMetrics();
	drawControls(DirectionIndex.NextTrial);
}

function checkResponse(response_key){
	var x, y,cue_x,cue_y,cue_index;
	var noextra = true;
	if(next < CurrentCuePos){
		x =  Path[next][0];
		y = Path[next][1];
		cue_x = Cue[next][0];
		cue_y = Cue[next][1]*-1;
		cue_code = 10 * (cue_x + 2) + (cue_y + 2);
		cue_index = findIndex(expectedDirection,cue_code);
		TrialLabels.push(DirectionLabels[cue_index]);
		ResponseLabels.push(DirectionLabels[response_key]);
		ResponseTime.push(InterResponseTime);
		TotalResponseTime = TotalResponseTime + InterResponseTime;
	}
	else{
		noextra = false;
		cue_index = -2;
		ExtraResponse.push(DirectionLabels[response_key]+" : " + InterResponseTime);
	}
	if(response_key == cue_index){
		count++;
		Hit++;
		TotalHit++;
		if(VisualError && noextra){Maze[x][y] = 4 * (TrialNo % 2) + 3;}
	}
	else{
		if(AudioError){playError();}
		Miss++;
		TotalMiss++;
		count--;
		if(VisualError && noextra){Maze[x][y] = 4 * (TrialNo % 2) + 4;}
	}
	currentAccuracy = 100*TotalHit/(TotalStimuli);
	drawMaze(Maze,MazeLength);
	drawMetrics();
	drawControls(response_key);
	next++;
}

function isCompleteResponse(){
	var TRTime = 0;
	if(next<CurrentCuePos){
		while(next<CurrentCuePos){
			var x =  Path[next][0];
			var y = Path[next][1];
			var cue_x = Cue[next][0];
			var cue_y = Cue[next][1]*-1;
			var cue_code = 10 * (cue_x + 2) + (cue_y + 2);
			var cue_index = findIndex(expectedDirection,cue_code);
			TrialLabels.push(DirectionLabels[cue_index]);
			ResponseLabels.push('NoInput');
			TRTime = TotalResponseTime + InterResponseTime;
			if(VisualError){Maze[x][y] = 4 * (TrialNo % 2) + 4;}
			Miss++;
			count--;
			next++;
		}
		TotalResponseTime = TRTime;
	}
	for(var i=TrialLabels.length;i<WM_SETSIZE;i++){
		TrialLabels.push('empty');
		ResponseLabels.push('empty');
		ResponseTime.push('0.0');
	}
}

function isCompleteMap(){
	if(CurrentCuePos==TotalStimuli && PopNextFunction == 0){ // pop next function for new Maps
		if(Staircase){
			var recallPercent;
			for(var isi = 0; isi < ISI_Recall.length; isi++){
				recallPercent = (ISI_Recall[isi]/ISI_Trial)*100;
				if(recallPercent >= StaircaseAccuracy){
					candidateISI.push(ISI_Value[isi]);
				}
			}
			isStaircaseCollision();
		}

		drawMaze(Maze,MazeLength);
		drawMetrics();
		SaveCanvasImage();
		isConsecutiveMapAccuracy();
		next = 0;
		Hit = 0; TotalHit = 0;
		Miss = 0; TotalMiss = 0;
		ResponseTime = []; TotalResponseTime = 0;
		CurrentCuePos = 0;
		count=0; TotalRecall=0; Recall = 0;
		TrialNo = 0;
		PopNextFunction = 1;
		AverageResponseTime = 0;
		return true;
	}
	else{
		return false;
	}
}

function isStaircaseCollision(){
	var CollisionList = [];
	if(candidateISI.length == 0){
		BestISI = '';
		Collision = 2;
	}
	else if(Collision == 0){
		for(var i =0 ; i <candidateISI.length-1;i++){
			if(parseInt(candidateISI[i+1])-parseInt(candidateISI[i])>StaircaseDistance){
				CollisionList.push(candidateISI[0]);
				CollisionList.push(candidateISI[0]);
				CollisionList.push(candidateISI[0]);
				CollisionList.push(candidateISI[0]);
				CollisionList.push(candidateISI[0]);
				CollisionList.push(candidateISI[i+1]);
				CollisionList.push(candidateISI[i+1]);
				CollisionList.push(candidateISI[i+1]);
				CollisionList.push(candidateISI[i+1]);
				CollisionList.push(candidateISI[i+1]);
				Collision++;
				break;
			}
		}
	}
else{
		Collision = 3;
		BestISI = candidateISI[0];  //as minimum isi value is always at top
	}
	console.log('candidate ISI: '+ candidateISI + 'Collision:' + Collision);
	switch(Collision){
		case 0: FQCounter--;
						FileIndex++;
						FunctionQueue.shift();
						console.log("Spliced the Collision Staircase function call");
						TimeStamp = new Date().toString();
						save(ISID_Filename,[USERID,BestISI,TimeStamp]);
						break;
		case 1: ISIList = CollisionList;
						ISI_Trial = CollisionList.length/2;
						ISICounter = 0;
						ISI_Recall = [0,0,0,0,0,0,0];
						candidateISI = [];
						break;
		case 2: ExperimentMsg = 'For None of the ISI value, '+ ISI_Recall + ' Recall > ' + StaircaseAccuracy +', Terminating Experiment'
						console.log(ExperimentMsg);
						ExperimentEnd = 1;
						clearInterval(checkFunctionQueue);
						stopExperiment();
		case 3: TimeStamp = new Date().toString();
						save(ISID_Filename,[USERID,BestISI,TimeStamp]);
	}
}

function SaveCanvasImage(){
	var canvas = document.getElementById('Maze_Canvas');
	var imageURL = canvas.toDataURL('image/png');
	var filename = User_DataFolder + USERID + '_' + PHASENO + '_' + CurrentMode + "_Dir_" + Direction + "_Map_" + CurrentMapNo + "_FI_" + FileIndex + ".png";
	$.ajax({
		type: 'POST',
		data: {'Name': filename,
			'image': imageURL},
		url: url + saveImage,
		success: function(data) {
			console.log(data);
		}
	});
//	var savecanvas = document.createElement('a');
//	savecanvas.href = canvas.toDataURL('image/png').replace('image/png');
//	savecanvas.download= USERID + "_" + CurrentMode + "_Dir_" + Direction + "_Map_" + CurrentMapNo +"_PL_" + TotalSteps + "_FI_" + FileIndex + ".png";
//	document.body.appendChild(savecanvas);
//	savecanvas.click();
}

function isConsecutiveMapAccuracy(){
	consecutiveMapAccuracy = (consecutiveMapAccuracy + currentAccuracy)/ConsecutiveMap;
	console.log('Consecutive Map Accuracy: ' + consecutiveMapAccuracy);
	var EM = ExperimentList[CurrentMode];
	if(CurrentMapNo-MinimumTrainingMap-consecutiveMapChunk>=ConsecutiveMap && EM <= 3){
		if(consecutiveMapAccuracy >= AccuracyThreshold){
			console.log("Accuracy for "+ ConsecutiveMap + " consecutive map is greater than " + AccuracyThreshold + "% threshold ,switching to another mode");
			var i = CurrentMapNo;
			while(i<NoOfMaps){
				FQCounter--;
				FileIndex++;
				FunctionQueue.shift();
				console.log("Spliced the function call");
				i++;
			}
		}
		else{
			consecutiveMapChunk++;
			consecutiveMapAccuracy = 0;
		}
	}
	else if(CurrentMapNo==NoOfMaps && EM <= 3){
		ExperimentMsg = "Accuracy for "+ ConsecutiveMap + " consecutive map is less than " + AccuracyThreshold + "% threshold , Terminating Experiment";
		console.log(ExperimentMsg);
		ExperimentEnd = 1;
		var i = CurrentMapNo;
		while(i<NoOfMaps){
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
//globalID = requestAnimationFrame(joyStickResponse);
function KeyBoardResponse(){
	if(StartExp && !ExperimentEnd && KeyBoard){
		var key_code = event.keyCode;
		var key_index_a = findIndex(inputDirection_a,key_code);
		var key_index_b = findIndex(inputDirection_b,key_code);
		var input_index = key_index_a > key_index_b ? key_index_a:key_index_b;
		if(key_index_a == 9 ||key_index_b==9){
			console.log("Key Pressed, Play Next Trial");
			playNextTrial();
		}
		else if(key_index_a == -1 && key_index_b == -1){
			console.log('Invalid Input');
		}
		else{
			InterResponseTime = (new Date().getTime() - waitTime)/1000;
			waitTime = new Date().getTime();
			console.log(input_index);
			console.log("Response Recorded: ");
			checkResponse(input_index);
		}
	}
	else{
		console.log('No Input');
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