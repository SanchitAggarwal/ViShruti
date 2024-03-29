// Experiment Parameters
var ExperimentMode,InterStimulusInterval,NoOfMaps,AccuracyThreshold;
var DisplayGrid = 0,VisualError = 0,AudioError = 0;  // Flag for Visual or Error Feedback and DisplayGrid
var ExperimentResults = []; //To Store the Experiment Results and Export it to CSV or Spreadsheet
var ExperimentEnd = 0;
var initialNoofSteps = 10,TestingPathLength = 50, TestingMaps = 3, WM_Maps = 5, WM_PathLength = 35;
var VisualCue = 0;  //if 0 no visual cue, 1 - correct visual cue, 2 - incorrect visual cue
var RandomOrder = 0,RandomorderCue = [2,3,4,5,6,7,8],ro_index = 0;
// Participant Details
var Form_pd,USERID,AGE,EDUCATION,MODEOFCOMM,GENDER,PARTICIPANT_TYPE,MUSICAL_TRAINING,MUSIC_KIND,HEARING_PROBLEM,KEYBOARD_FAMILIARITY;
var ExperimentTime = 0,AvgAccuracy = 0,NMaps, Accuracy = [];
var FunctionQueue = [],FQCounter,checkFunctionQueue,PopNextFunction = 1,FileIndex = 0;
var Familirization = false;
var FamiliarMap = 8, FamiliarCue = [2,2,2,2,2,3,3,3,3,3],Familiar_PathLength = 25;
var FamiliarRecall = 0,maxRecall = 0,FamiliarISI = '';
var ISIList = ['200','25','50','100','200','300','400','500'],ISICounter = 0;
// variable for each trials and maze generation
var Maze,Path,Cue,Direction,Level,TotalSteps,MazeLength;
//var pitch = [440,523,622];   //predefined notes in hz 18/Feb/2014
var pitch = [440,880,1760];   //predefined notes in hz
var rate = 44100; //sample per sec
var volume = 50; //amplitude of sine wave
var next = 0;  // For Next move
var ResponseTime = 0, CueTime = 0,IntervalTime = 0;
var Hit = 0,Miss = 0,Recall = 0,count=0;
var inputDirection_a = [36,38,33,37,12,39,35,40,34,32];   //added 32 for spacebar
var inputDirection_b = [103,104,105,100,101,102,97,98,99,32]; //added 32 for spacebar
var expectedDirection = [13,23,33,12,22,32,11,21,31];
var DirectionLabels = ['NW',' N','NE',' W',' C',' E','SW',' S','SE','Space'];
var CueLabels = [];
var InputLabels = [];
var InputTime = [];
var CurrentMapNo;
var Sounds = [];
var CurrentCuePos = 0;
var counter = 0;
var start_x,start_y,inc_sx,inc_sy;
var CurrentMode;
var InterTrialInterval = '500';  //in milliseconds
var silencefile;
var startexp = false;
var cueno = 0;
var SelectedMode;
var AccuracyFlag = 3;
var DayNo;
var InstructionFile = "./Instructions/", AlertMessage = '', InsFile = '', InsFlag = false, Instructions = [], InsCounter = 0;
var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
// Experiment List
var ExperimentList = {'Audio_Error_FeedBack_Training':1,
                      'Visual_Error_FeedBack_Training':2,
                      'User_Directed':3,
                      'UnSupervised_Training':4,
                      'No_Training':5,
                      'Testing':6,
                      'Working_Memory':7,
                      'Familiarization':8  };
                      /*'InCorrectVisualCue':7,
                      'WM_Order_Ascending':8,
                      'WM_Order_Descending':9,
                      'WM_Order_Random':10};*/
// To validate Participant Details
function participantDetails(){
    Form_pd = document.ParticipantDetail;
    USERID = Form_pd.USERID.value;
    AGE = Form_pd.AGE.value;
    EDUCATION = Form_pd.EDUCATION.value;
    MODEOFCOMM = Form_pd.MODEOFCOMM.value;
    GENDER = Form_pd.GENDER.value;
    PARTICIPANT_TYPE = Form_pd.PARTICIPANT_TYPE.value;
    MUSICAL_TRAINING = Form_pd.MUSICAL_TRAINING.value;
    MUSIC_KIND = Form_pd.MUSIC_KIND.value;
    HEARING_PROBLEM = Form_pd.HEARING_PROBLEM.value;
    KEYBOARD_FAMILIARITY = Form_pd.KEYBOARD_FAMILIARITY.value;
    DayNo = Form_pd.DayNo.value;

    if (!(DayNo == "" || USERID == "" || isNaN(AGE) || AGE < 1 || EDUCATION == "" || MODEOFCOMM == "" || GENDER == "" || PARTICIPANT_TYPE == "" || MUSICAL_TRAINING == "" || MUSIC_KIND == "" || HEARING_PROBLEM == "" || KEYBOARD_FAMILIARITY == "")) {
        USERID = USERID.concat('_',DayNo);
        ExperimentResults.push(['USER_ID', 'AGE', 'EDUCATION', 'MODE_OF_COMMUNICATION', 'GENDER', 'PARTICIPANT_TYPE', 'MUSICAL_TRAINING', 'MUSIC_KIND', 'HEARING_PROBLEM', 'KEYBOARD_FAMILIARITY', 'InterTrialInterval']);
        ExperimentResults.push([USERID, AGE, EDUCATION, MODEOFCOMM, GENDER, PARTICIPANT_TYPE, MUSICAL_TRAINING, MUSIC_KIND, HEARING_PROBLEM, KEYBOARD_FAMILIARITY, InterTrialInterval]);
        ExperimentResults.push(['Index#', 'Direction', '# of Stimuli per Trial', 'Experiment Mode', 'Accuracy Threshold', 'Total Steps in Map', '#Hit', '#Wrong Response', 'Accuracy', 'Recall', 'ResponseTime(in Sec)', 'Average Response Time (in Sec)', 'MaximumTrainingMaps', 'Input Time per response', 'Stimuli Direction Labels', 'Response Direction Labels','InterStimulusInterval','Average Accuracy']);
        $('#contactModal').modal('hide');
        if ($(".fa-user").hasClass('detailsAdded') == false) {
            $(".fa-user").addClass('detailsAdded');
        }
        enableExperimentParams();
    }
    else {
        if(document.getElementById("Dummy").checked){
            USERID = 'Test'; AGE = 25; EDUCATION = "ABC"; MODEOFCOMM = "Telugu"; GENDER = "Male"; PARTICIPANT_TYPE = "Normal"; MUSICAL_TRAINING = "Yes"; MUSIC_KIND = "ABC";
            HEARING_PROBLEM = "No"; KEYBOARD_FAMILIARITY = "Yes"; DayNo = "Day_1";
            $('#contactModal').modal('hide');
            if ($(".fa-user").hasClass('detailsAdded') == false) {
                $(".fa-user").addClass('detailsAdded');
            }
            enableExperimentParams();
        }
        else{
            alert("Please Enter Valid Participant Details");
        }
    }
    InstructionFile = InstructionFile.concat(MODEOFCOMM,'/');
}
function DummyData(){
    Form_pd = document.ParticipantDetail;
    if(document.getElementById("Dummy").checked){
        Form_pd.USERID.value = 'Dummy_User';
        Form_pd.AGE.value = '25';
        Form_pd.EDUCATION.value = 'MS';
        Form_pd.MODEOFCOMM.value = 'English';
        Form_pd.GENDER.value = 'Male';
        Form_pd.PARTICIPANT_TYPE.value = 'Normal';
        Form_pd.MUSICAL_TRAINING.value = 'No';
        MUSIC_KIND = Form_pd.MUSIC_KIND.value = 'None';
        Form_pd.HEARING_PROBLEM.value = 'No';
        Form_pd.KEYBOARD_FAMILIARITY.value = 'Yes';
        Form_pd.DayNo.value = 'Day_1';

        document.getElementById("ExperimentMode").value = 'Visual_Error_FeedBack_Training';
        document.getElementById("NoOfMaps").value = '10';
        document.getElementById("AccuracyThreshold").value = '80';
        document.getElementById("TestingPathLength").value = '50';
        document.getElementById("InterStimulusInterval").disabled = true;
        document.getElementById("Familirization").disabled = true;
        document.getElementById("InterStimulusInterval").value = '';
        document.getElementById("Familirization").checked = false;
    }
    else{
        Form_pd.USERID.value = '';
        Form_pd.AGE.value = '';
        Form_pd.EDUCATION.value = '';
        Form_pd.MODEOFCOMM.value = '';
        Form_pd.GENDER.value = '';
        Form_pd.PARTICIPANT_TYPE.value = '';
        Form_pd.MUSICAL_TRAINING.value = '';
        MUSIC_KIND = Form_pd.MUSIC_KIND.value = '';
        Form_pd.HEARING_PROBLEM.value = '';
        Form_pd.KEYBOARD_FAMILIARITY.value = '';
        Form_pd.DayNo.value = '';
        document.getElementById("ExperimentMode").value = '';
        document.getElementById("NoOfMaps").value = '';
        document.getElementById("AccuracyThreshold").value = '';
        document.getElementById("TestingPathLength").value = '';
        document.getElementById("InterStimulusInterval").disabled = false;
        document.getElementById("Familirization").disabled = false;
        document.getElementById("InterStimulusInterval").value = '';
        document.getElementById("Familirization").checked = false;
    }
}
// To Enable Experiment Parameters Control
function enableExperimentParams(){
    document.getElementById("ExperimentMode").disabled = false;
    document.getElementById("NoOfMaps").disabled = false;
    document.getElementById("AccuracyThreshold").disabled = false;
    document.getElementById("StartExp").disabled = false;
    document.getElementById("SavePD").disabled = true;
    document.getElementById("TestingPathLength").disabled = false;
    /*document.getElementById("Familirization").disabled = false;
    document.getElementById("InterStimulusInterval").disabled = false;*/
}
function disable(){
    if(document.getElementById("ExperimentMode").value == "Working_Memory"){
        document.getElementById("NoOfMaps").disabled = true;
        document.getElementById("AccuracyThreshold").disabled = true;
        document.getElementById("StartExp").disabled = false;
        document.getElementById("SavePD").disabled = true;
        document.getElementById("TestingPathLength").disabled = true;
        document.getElementById("InterStimulusInterval").disabled = false;
        document.getElementById("Familirization").disabled = false;
    }
    else{
        document.getElementById("NoOfMaps").disabled = false;
        document.getElementById("AccuracyThreshold").disabled = false;
        document.getElementById("StartExp").disabled = false;
        document.getElementById("SavePD").disabled = true;
        document.getElementById("TestingPathLength").disabled = false;
        document.getElementById("InterStimulusInterval").disabled = true;
        document.getElementById("Familirization").disabled = true;
    }
}
function enableISI(){
    if(document.getElementById("Familirization").checked){
        document.getElementById("InterStimulusInterval").disabled = true;
    }
    else{
        document.getElementById("InterStimulusInterval").disabled = false;
    }
}
// To Validate Experiment Parameters
function validateExperimentParams(){
  ExperimentMode = document.getElementById("ExperimentMode").value;
  SelectedMode = document.getElementById("ExperimentMode").value;
  if(ExperimentMode == "Working_Memory"){
      NoOfMaps = 5;
      AccuracyThreshold = 61;
      TestingPathLength = 105;
      Familirization = document.getElementById("Familirization").checked;
      if(Familirization)  {
          InterStimulusInterval = '25';
          FamiliarISI = '';
          InterStimulusInterval = InterStimulusInterval.toString();
      }
      else{
          InterStimulusInterval = document.getElementById("InterStimulusInterval").value;
          FamiliarISI =  InterStimulusInterval;
          InterStimulusInterval = InterStimulusInterval.toString();
      }
  }
  else{
      NoOfMaps = parseInt(document.getElementById("NoOfMaps").value);
      AccuracyThreshold = parseInt(document.getElementById("AccuracyThreshold").value);
      TestingPathLength = parseInt(document.getElementById("TestingPathLength").value);
      Familirization = false;
      InterStimulusInterval = '500';
      FamiliarISI =  InterStimulusInterval;
      InterStimulusInterval = InterStimulusInterval.toString();
  }
  if(ExperimentMode=="" || isNaN(NoOfMaps) || isNaN(AccuracyThreshold) || NoOfMaps <5 || AccuracyThreshold <60 || isNaN(TestingPathLength) || TestingPathLength <10 || InterStimulusInterval==""){
    alert("Please Enter Valid Experiment Parameters, No of Maps must be greater than equal to Five.");
  }
  else{
/*    var str1 = "./Silence/silence";
    silencefile = str1.concat(InterStimulusInterval,'.mp3');*/
    //call start experiment
    startExperiment();
  }
}
// To start experiment and set the initial parameters
function startExperiment(){
    document.getElementById("StopExp").disabled = false;
    document.getElementById("StartExp").disabled = true;
    document.getElementById("ExperimentMode").disabled = true;
    //document.getElementById("WorkingMemory").disabled = true;
    document.getElementById("NoOfMaps").disabled = true;
    document.getElementById("AccuracyThreshold").disabled = true;
    //document.getElementById("Reverse").disabled = true;
    document.getElementById("TestingPathLength").disabled = true;
    document.getElementById("Familirization").disabled = true;
    //document.getElementById("InterStimulusInterval").disabled = true;
    $('#StartExp').removeClass('btn-primary');
    $('#StartExp').addClass('btn-default');
    $('#StopExp').removeClass('btn-default');
    $('#StopExp').addClass('btn-primary');
    //alert("Get Ready with Controls, Press the Enter Key to start the Experiment.");
    //startexp = true;
    ExperimentTime = new Date().getTime();
    ExperimentModeTest();
    checkFunctionQueue = setInterval(function(){callNextFunction()},3000);  //Check function queue after every 3 seconds
    FQCounter = FunctionQueue.length;
}
// To Set Display and Error
function setDisplayAndError(Key){
  switch(Key){
    case 1 :DisplayGrid = 0; VisualError = 1; AudioError = 1; VisualCue = 0; RandomOrder = 0;  break;
    case 2 :DisplayGrid = 1; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0;  break;
    case 3 :DisplayGrid = 1; VisualError = 1; AudioError = 1; VisualCue = 1; RandomOrder = 0;  break;
    case 4 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0;  break;
    case 5 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0;  break;
    case 6 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0;  break;
    case 7 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 1;  break;
    case 8 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0;  break;
    /*case 8 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0; break;
    case 9 :DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 0; WM_StepsInEachCue.reverse(); break;
    case 10:DisplayGrid = 0; VisualError = 1; AudioError = 0; VisualCue = 0; RandomOrder = 1; break;
  */
  }
}
// To Stop Experiment In Between
function stopExperiment(){
  startexp = false;
  if(ExperimentEnd){
    document.getElementById("StopExp").disabled = true;
    document.getElementById("StartExp").disabled = false;
    $('#StopExp').removeClass('btn-primary');
    $('#StopExp').addClass('btn-default');
    $('#StartExp').removeClass('btn-default');
    $('#StartExp').addClass('btn-primary');
    ExperimentTime = (new Date().getTime() - ExperimentTime)/1000;
    SetInstruction(-1,0);
    //alert("Experiment Finished !! \nThank You For Participating "+ USERID+ "\nYou Took : " + (ExperimentTime/60).toFixed(3) + " Minutes\n Have a Nice Day.");
    //saveExperimentResults
    saveExperimentResults();
    //Reload the page
    //location.reload();
    document.getElementById("StopExp").disabled = true;
    document.getElementById("StartExp").disabled = false;
  }
  else{
    var r=confirm("Experiment Not Yet Finished !!\nConfirm To Stop Experiment In Between !!\n Only Half Results Will be saved !!");
    if (r==true){
      ExperimentEnd = 1;
      // clear the polling variable
      clearInterval(checkFunctionQueue);
      stopExperiment();  // call stop experiment again
    }
  }
}
// To run the selected mode
function runMode(CueLength,PathLength,Direction,Map,Mode){
  var i = 1;
  while( i <= Map) {
    var fun = addToFunctionQueue(run_Map, this, new Array(i,CueLength,PathLength,Direction,Mode,Map));
    FunctionQueue.push(fun);
    i++;
  }
}
/*// configure runmode for working memory
function workingMemoryTest(Direction){
  if(RandomOrder){
    runMode(0,176,Direction,1,ExperimentMode);
    runMode(0,176,Direction,1,ExperimentMode);
    runMode(0,176,Direction,1,ExperimentMode);
  }
  else{
    for(var i = 0;i<WM_StepsInEachCue.length;i++){
      var CueLength =  WM_StepsInEachCue[i];
      var PathLength = CueLength * initialNoofSteps;
      runMode(CueLength,PathLength,Direction,1,ExperimentMode);
    }
  }
}*/
function ExperimentModeTest(){
  do{
    var Key = ExperimentList[ExperimentMode];
    setDisplayAndError(Key);
    if(Key == 5 || Key == 6){
      ExperimentEnd = 1;
      for(var dir = 4;dir<=8;dir=dir+4){
        //alert(ExperimentMode + " : " + dir +" Direction are Used");
        //runMode(1,initialNoofSteps,dir,1,ExperimentMode);
        runMode(1,TestingPathLength,dir,TestingMaps,ExperimentMode);
        //runMode(1,TestingPathLength,dir,1,ExperimentMode);
        //runMode(1,TestingPathLength,dir,1,ExperimentMode);
      }
    }
    else if(Key == 7){
        ExperimentEnd = 1;
        if(Familirization){
            ExperimentMode = 'Familiarization';
            runMode(0,Familiar_PathLength,4,FamiliarMap,ExperimentMode);
        }
        ExperimentMode = 'Working_Memory';
        if(RandomOrder){
            for(var dir = 4;dir<=8;dir=dir+4){
                runMode(0,WM_PathLength,dir,WM_Maps,ExperimentMode);
                //runMode(0,105,dir,1,ExperimentMode);
                //runMode(0,105,dir,1,ExperimentMode);
            }
        }
    }
    else {
      for(var dir = 4;dir<=8;dir=dir+4){
        //alert(ExperimentMode + " : " + dir + " Direction are Used");
        runMode(1,initialNoofSteps,dir,NoOfMaps,ExperimentMode);
      }
      ExperimentMode = "Testing";
    }
  }while(!ExperimentEnd); //alert("Experiment Mode Ended");
  ExperimentEnd = 0;
}
function saveExperimentResults(){
  for(var i=3;i<ExperimentResults.length;i++){
    $.ajax({
      type: "POST",
      //url: "https://docs.google.com/forms/d/1HYqxuBrAA3idjzjqBLwCEGcnnL_WbOL6oCrBBvMF7sI/formResponse",
      url: "https://docs.google.com/forms/d/1XCgK4jjuhv2BBwQ8Muzmz2zMhmX3C6sf7pyf1Y6UhWE/formResponse",
      data: {
          'entry.452712856' :USERID,
          'entry.1217543975':AGE,
          'entry.1047119998':EDUCATION,
          'entry.1297203076':MODEOFCOMM,
          'entry.1383316539':GENDER,
          'entry.453829439' :PARTICIPANT_TYPE,
          'entry.481881047' :MUSICAL_TRAINING,
          'entry.1963578379':MUSIC_KIND,
          'entry.437891093' :HEARING_PROBLEM,
          'entry.518374845' :KEYBOARD_FAMILIARITY,
          'entry.281696488' :ExperimentResults[i][0], //Index#
          'entry.501651834' :ExperimentResults[i][1], //Direction
          'entry.486615617' :ExperimentResults[i][2], //Cue Length
          'entry.56018046'  :ExperimentResults[i][3], //Experiment Mode
          'entry.1372960057':ExperimentResults[i][4], //Accuracy Threshold
          'entry.561470756' :ExperimentResults[i][5], //Total Steps
          'entry.1450128684':ExperimentResults[i][6], //#Hit
          'entry.631366225' :ExperimentResults[i][7], //#Wrong Response
          'entry.740927359' :ExperimentResults[i][8], //Accuracy
          'entry.481811278' :ExperimentResults[i][9], //Recall
          'entry.1724321037':ExperimentResults[i][10],//ResponseTime(in Sec)
          'entry.1184871699':ExperimentResults[i][11],//Average Response Time (in Sec)
          'entry.1943108855':ExperimentResults[i][12],//No of Training Maps
          'entry.239911530' :ExperimentResults[i][13],//Input Time per response
          'entry.786668683' :ExperimentResults[i][14],//Cue Direction Labels
          'entry.2065638177':ExperimentResults[i][15],//Input Direction Labels
          'entry.1313234140':ExperimentResults[i][16],//InterStimulusInterval
          'entry.263350514':ExperimentResults[i][17],// Average Accuracy after Nth Map
          'entry.1348081382':InterTrialInterval // Inter Trial Interval
      }
    });
  }

  var csvRows = [];
  for(var i=0, l=ExperimentResults.length; i<l; ++i){
    csvRows.push(ExperimentResults[i].join(';'));
  }
  var csvString = csvRows.join("%0A");
  var savecsv         = document.createElement('a');
  savecsv.href        = 'data:attachment/csv,' + csvString;
  savecsv.target      = '_blank';
  savecsv.download    = USERID +'.csv';
  document.body.appendChild(savecsv);
  savecsv.click();
  alert("Your results are saved successfully");
}
var addToFunctionQueue =  function(fn, context, params) {
  return function() {
    fn.apply(context, params);
  };
}
function callNextFunction() {
  if(FQCounter<0){
    ExperimentEnd = 1;
    // clear the polling variable
    clearInterval(checkFunctionQueue);
    stopExperiment();
  }
  // Remove and execute all items in the array
  if(PopNextFunction){
    PopNextFunction = 0;
    FQCounter--;
    FileIndex++;
    ro_index = 0;
    RandomorderCue = shuffle(RandomorderCue);
    FamiliarCue = shuffle(FamiliarCue);
    if(FunctionQueue.length){
      (FunctionQueue.shift())();}
  }
}
function onUserInput() {
  var waitTime = new Date().getTime();
  if(!Sounds[counter] && counter>0){
      startexp = true;
  }
  if(startexp && !ExperimentEnd){
      //var key_press = String.fromCharCode(event.keyCode);
      var key_code = event.keyCode;
      var key_index_a = findIndex(inputDirection_a,key_code);
      var key_index_b = findIndex(inputDirection_b,key_code);
      if(key_index_a == -1 && key_index_b == -1){
          console.log('Invalid Input');
      }
      else{
          if(key_index_a == 9 ||key_index_b==9){
              console.log('Spacebar: next '+next+' CurrentCuePos '+CurrentCuePos+" TotalSteps:"+TotalSteps);
              while(next<CurrentCuePos){
                  var x =  Path[next][0];
                  var y = Path[next][1];
                  var cue_x = Cue[next][0];
                  var cue_y = Cue[next][1]*-1;
                  var cue_code = 10 * (cue_x + 2) + (cue_y + 2);
                  var cue_index = findIndex(expectedDirection,cue_code);
                  CueLabels.push(DirectionLabels[cue_index]);
                  InputLabels.push('NoInput');
                  if(VisualError){Maze[x][y] = 4 * (cueno % 2) + 4;}
                  Miss++;
                  count--;
                  next++;
              }
              // Add marker in input and cue labels
              CueLabels.push(DirectionLabels[key_index_a]);
              InputLabels.push(DirectionLabels[key_index_a]);
              if(count==Level){Recall++;}
              InputTime.push(IntervalTime);
              ResponseTime = ResponseTime + IntervalTime;
              IntervalTime = 0;
              count=0;
              next = CurrentCuePos;
              if(CurrentCuePos==TotalSteps && PopNextFunction == 0){ // pop next function for new Maps
                  if(Familirization){
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
                  savecanvas.download= USERID + "_" + CurrentMode + "_Dir_" + Direction + "_Map_" + CurrentMapNo +"_PL_" + TotalSteps + "_FI_" + FileIndex + ".png";
                  document.body.appendChild(savecanvas);
                  savecanvas.click();

                  if(RandomOrder){
                      Level = RandomorderCue.toString();
                  }
                  if(Familirization){
                      Level = FamiliarCue.toString();
                  }
                  var currentAccuracy = 100*Hit/(TotalSteps);
                  AvgAccuracy = ((CurrentMapNo - 1)*AvgAccuracy + currentAccuracy)/CurrentMapNo;
                  console.log(AvgAccuracy);
                  ExperimentResults.push([FileIndex,Direction,Level,CurrentMode,AccuracyThreshold,TotalSteps,Hit,Miss,100*Hit/(TotalSteps),Recall,ResponseTime,ResponseTime/TotalSteps,NoOfMaps,InputTime.toString(),CueLabels.toString(),InputLabels.toString(),InterStimulusInterval,AvgAccuracy]);
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
                      if(CurrentMapNo==NMaps && KeyExp < 5){
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
                  cueno = 0;
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
                  if(VisualError && noextra){Maze[x][y] = 4 * (cueno % 2) + 3;}
              }
              else{
                  IntervalTime = IntervalTime + (waitTime - CueTime)/1000;
                  CueTime = new Date().getTime();
                  if(AudioError){playError();}
                  Miss++;
                  count--;
                  if(VisualError && noextra){Maze[x][y] = 4 * (cueno % 2) + 4;}
              }
              drawMaze(Maze,MazeLength);
              drawMetrics();
              drawControls(key_index_a>key_index_b?key_index_a:key_index_b);
              next++;
          }
      }
  }
}
document.onkeyup = onUserInput;
function run_Map(MapNo,CueLength,PathLength,Dir,Mode,Map){
    if(Dir != Direction || Mode != CurrentMode){
        InsFlag = true;
        AccuracyFlag = 3;
        SetInstruction(ExperimentList[Mode],Dir);
    }
    else{
        //playInstruction(InstructionFile.concat('NextMap.wav'));
        SetInstruction(0,0);
        startexp = false;
        //alert("Current Map is Finished.Press Enter for Next Map.");
    }
  console.log('MapNo '+MapNo+' CueLength '+CueLength+ ' PathLength ' + PathLength+ ' Direction ' + Dir +' Mode '+Mode+' Map '+Map);
  NMaps = Map;
  Level = CueLength;
  Direction =   Dir;
  TotalSteps = PathLength;
  CurrentMapNo = MapNo;
  CurrentMode = Mode;
  /*var Key = ExperimentList[CurrentMode];
  console.log(Key);
  setDisplayAndError(Key);
  console.log('RandomOrder '+RandomOrder +' CueLength '+Level);
  var MazeDiv = document.getElementById('MazeDiv');
  //console.log(DisplayGrid);
  if(DisplayGrid==0){
    MazeDiv.style.visibility = 'hidden'; // hide, but let the element keep its size

  }
  else{
    MazeDiv.style.visibility = 'visible';
  }
  CueLabels = [];
  InputLabels = [];
  InputTime = [];
  generateMaze();
  drawMaze(Maze,MazeLength);
  drawMetrics();
  drawControls(-1);
  if(!InsFlag){
      NextCue();
      playSounds();
      CueTime =  new Date().getTime();
  }*/
}
function generateMaze(){
  var Blocks = 4 * TotalSteps;
  MazeLength = Math.ceil(Math.sqrt(Blocks));
  var Neighbour = getNeighbours(Direction/4);
  var NoOfNbr = Neighbour.length;
  var flag = 0;
  do{
    flag = 0;
    Maze = new Array(MazeLength);
    for(var i = 0; i<MazeLength;i++){
      Maze[i] = new Array(MazeLength);
      for(var j = 0; j<MazeLength;j++){
        Maze[i][j] = 6;
      }
    }
    Path =  new Array(TotalSteps);
    Cue = new Array(TotalSteps);
    for(var i = 0; i<TotalSteps;i++){
      Path[i] = new Array(2);
      Cue[i] = new Array(2);
    }
    //alert('Draw Maze');
    //drawMaze(Maze,MazeLength);
    var Steps = 0;
    var prev_pos_x = Math.floor(Math.random()*MazeLength);
    var prev_pos_y = Math.floor(Math.random()*MazeLength);
    //alert('prev_pos_x ' + prev_pos_x + ' prev_pos_y ' + prev_pos_y );
    var new_pos_x,new_pos_y;
    Maze[prev_pos_x][prev_pos_y] = 5;     //Starting Cell
    start_x = prev_pos_x;
    start_y = prev_pos_y;
    inc_sx = prev_pos_x;
    inc_sy = prev_pos_y;
    var NextNbr = 0,pos_x,pos_y;
    while(Steps < TotalSteps && flag == 0){
      flag = 1;
      for(var nbr=0;nbr<NoOfNbr;nbr++){
        pos_x = prev_pos_x + Neighbour[nbr][0];
        pos_y = prev_pos_y + Neighbour[nbr][1];
        if(pos_x >= 0 && pos_x < MazeLength){
          if(pos_y >= 0 && pos_y < MazeLength){
            if(Maze[pos_x][pos_y] == 6){
              flag = 0;
            }
          }
        }
      }
      if(flag == 0){
        NextNbr =  Math.floor(Math.random()*NoOfNbr);
        //alert('Next Neighbour ' + NextNbr);
        new_pos_x = prev_pos_x + Neighbour[NextNbr][0];
        new_pos_y = prev_pos_y + Neighbour[NextNbr][1];
        //alert('new_pos_x ' + new_pos_x + ' new_pos_y ' + new_pos_y );
        if(new_pos_x >= 0 && new_pos_x < MazeLength){
          if(new_pos_y >= 0 && new_pos_y < MazeLength){
            if(Maze[new_pos_x][new_pos_y] == 6){
              Maze[new_pos_x][new_pos_y] = 0;
              for(var nbr=0;nbr<NoOfNbr;nbr++){
                pos_x = prev_pos_x + Neighbour[nbr][0];
                pos_y = prev_pos_y + Neighbour[nbr][1];
                if(pos_x >= 0 && pos_x < MazeLength){
                  if(pos_y >= 0 && pos_y < MazeLength){
                    if(Maze[pos_x][pos_y] == 6){
                      Maze[pos_x][pos_y] = 1;
                    }
                  }
                }
              }
              prev_pos_x = new_pos_x;
              prev_pos_y = new_pos_y;
              Path[Steps][0] = prev_pos_x;
              Path[Steps][1] = prev_pos_y;
              Cue[Steps][0] = Neighbour[NextNbr][0];
              Cue[Steps][1] = Neighbour[NextNbr][1];
              Steps = Steps+1;
              //        alert('Draw Maze');
              //drawMaze(Maze,MazeLength);
              //alert('Steps Left '+StepsLeft);
            }
          }
        }
      }
    }
  }while(flag);

  for (var i = 0; i < MazeLength; i++){
    for (var j = 0; j < MazeLength; j++){
      if(Maze[i][j] == 6){
        Maze[i][j] = 1;
      }
    }
  }
  Maze[prev_pos_x][prev_pos_y] = 6;
  //alert('Draw Maze');
  drawMaze(Maze,MazeLength);
  drawMetrics();
  next = 0;
  Hit = 0;
  Miss = 0;
  ResponseTime = 0;
  CurrentCuePos = 0;
  count = 0;
  Recall = 0;
  counter = 0;
  Sounds = [];
  if(VisualCue == 0){
    for (var i = 0; i < MazeLength; i++){
      for (var j = 0; j < MazeLength; j++){
        Maze[i][j] = 6;
      }
    }
    Maze[start_x][start_y]=5;
    drawMaze(Maze,MazeLength);
  }
  //alert("Maze Generated");
}
function getNeighbours(Direction){
  var Neighbour;
  switch(Direction){
    case 1://4 Neighbours
      Neighbour = [
        [1,0],
        [0,1],
        [-1,0],
        [0,-1]
      ];
      break;
    case 2://8 Neighbours
      Neighbour = [
        [1,0],
        [1,1],
        [0,1],
        [-1,1],
        [-1,0],
        [-1,-1],
        [0,-1],
        [1,-1]
      ];
      break;
  }
  return Neighbour;
}
function drawMaze(Maze,MazeLength){
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.height;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var BlockWidth = Math.ceil((width - 50 - 3 * MazeLength)/MazeLength);
  var BlockHeight = Math.ceil((height - 50 - 3 * MazeLength)/MazeLength);
  var BlockColor = ['Yellow','Black','Orange','DarkGreen','DarkRed','Blue','White','Green','Red'];
  canvas.style.border = "black 5px solid";
  context.beginPath();
  context.clearRect(0, 0, width, height);
  //alert(MazeLength);
  var y = 25;
  for (var j = 0; j < MazeLength; j++){
    var x = 25;
    for (var i = 0; i < MazeLength; i++){
      context.fillStyle = BlockColor[Maze[i][j]];
      context.lineWidth = 1;
      context.strokeStyle = 'Black';
      context.fillRect(x, y , BlockWidth, BlockHeight);
      context.strokeRect(x, y , BlockWidth, BlockHeight);
      x = x + BlockWidth + 3;
    }
    y = y + BlockHeight + 3;
  }
}
function drawControls(key){
  var canvas = document.getElementById('Controls_Canvas');
  var width = canvas.width;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var BlockWidth = Math.ceil((width - 150 - 3 * 3)/3);
  var BlockHeight = Math.ceil((height - 150 - 3 * 3)/3);
  var BlockColor = ['Blue','White'];
  context.beginPath();
  context.clearRect(0, 0, width, height);
  //alert(MazeLength);
  if(Direction/4 == 1){
    var y = 25;
    for (var j = 0; j < 3; j++){
      var x = 25;
      for (var i = 0; i < 3; i++){
        //alert("Key" + key + "val" +(i+3*j));
        switch ((i+3*j)){
          case 0: case 1: case 2: case 3: case 5:
          context.clearRect(x, y , BlockWidth, BlockHeight);
          break;
          default : context.lineWidth = 1;
            context.strokeStyle = 'Black';
            context.fillStyle = BlockColor[((key==7&&(i+3*j)==7)||key-(i+3*j)==-3)?0:1];
            context.fillRect(x, y , BlockWidth, BlockHeight);
            context.strokeRect(x, y , BlockWidth, BlockHeight);
            context.fillStyle = "Black";
            context.font = "bold 14px Arial";
            var text = DirectionLabels[i+3*j - 3];
            if(text == ' C') {text = ' S'}
            context.fillText(text, x+BlockWidth/4, y+BlockHeight/2);

        }
        x = x + BlockWidth + 3;
      }
      y = y + BlockHeight + 3;
    }
  }
  else{
    var y = 25;
    for (var j = 0; j < 3; j++){
      var x = 25;
      for (var i = 0; i < 3; i++){
        //alert("Key" + key + "val" +(i+3*j));
        context.fillStyle = BlockColor[(key==(i+3*j))?0:1];
        context.lineWidth = 1;
        context.strokeStyle = 'Black';
        context.fillRect(x, y , BlockWidth, BlockHeight);
        context.strokeRect(x, y , BlockWidth, BlockHeight);
        context.fillStyle = "Black";
        context.font = "bold 14px Arial";
        context.fillText(DirectionLabels[i+3*j], x+BlockWidth/4, y+BlockHeight/2);
        x = x + BlockWidth + 3;
      }
      y = y + BlockHeight + 3;
    }
  }
    var spacebarwidth = x-3-BlockWidth/2;
    x=25;
    context.lineWidth = 1;
    context.strokeStyle = 'Black';
    context.fillStyle = BlockColor[key==9?0:1];
    context.fillRect(x, y , spacebarwidth, 0.6*BlockHeight);
    context.strokeRect(x, y , spacebarwidth, 0.6*BlockHeight);
    context.fillStyle = "Black";
    context.font = "bold 14px Arial";
    var text = DirectionLabels[9];
    context.fillText(text, x+spacebarwidth/3, y+BlockHeight/3);
}
function drawMetrics(){
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.height + 20;;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  context.clearRect ( width , 0 , canvas.width - width , height );
  context.fillStyle = "blue";
  context.font = "bold 16px Arial";
  var text_width = width;

  var text = "Mode: ";
  var metrics = context.measureText(text);
  context.fillText(text, text_width, 25);
  text_width = text_width + metrics.width + 2;

  text = CurrentMode.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 25);
  text_width = text_width + metrics.width + 10;

  text_width = width;
  text = "CueLength: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 2;

  if(RandomOrder){ text = "2,3,4,5,6,7 or 8"}
  else if(Familirization){ text = "2 or 3"}
  else{ text = Level.toString()};
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);

  text_width = width;
  text = "Direction Used: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);
  text_width = text_width + metrics.width + 2;

  text = Direction.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);

  text_width = text_width + metrics.width + 10;
  text = "Map: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);
  text_width = text_width + metrics.width + 2;

  text = FileIndex.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);

  text_width = width;
  text = "Hit: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 85);
  text_width = text_width + metrics.width + 2;

  text = Hit.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 85);
  text_width = text_width + metrics.width + 10;

  text = "Miss: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 85);
  text_width = text_width + metrics.width + 2;

  text = Miss.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 85);
  text_width = text_width + metrics.width + 10;

  text = "Recall: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 85);
  text_width = text_width + metrics.width + 2;

  text = Recall.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 85);

  text_width = width;
  text = "Response Time: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 105);
  text_width = text_width + metrics.width + 2;

  text = ResponseTime.toFixed(3);
  metrics = context.measureText(text);
  context.fillText(text, text_width, 105);
  text_width = text_width + metrics.width + 2;

  text = " sec ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 105);

  text_width = width;
  text = "Average Accuracy:";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 125);
  text_width = text_width + metrics.width + 2;

  text = AvgAccuracy.toFixed(3);
  metrics = context.measureText(text);
  context.fillText(text, text_width, 125);

  text_width = width;
  text = "Inter Stimulus Interval:";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 145);
  text_width = text_width + metrics.width + 2;

  text = InterStimulusInterval.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 145);
  text_width = text_width + metrics.width + 2;

  text = " milliseconds ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 145);

  text_width = width;
  text = "Inter Trial Interval:";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 165);
  text_width = text_width + metrics.width + 2;

  text = InterTrialInterval.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 165);
  text_width = text_width + metrics.width + 2;

  text = " milliseconds ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 165);
}
function NextCue(){
  cueno = cueno + 1;
  var str1 = "./Silence/silence";
  silencefile = str1.concat(InterStimulusInterval,'.wav');
  if(RandomOrder){
    Level = RandomorderCue[ro_index++];
  }
  if(Familirization){
        Level = FamiliarCue[ro_index++];
  }
  console.log('RandomOrder '+RandomOrder +' Level '+Level);
  for(var i=0;i<Level;i++){
    if(VisualCue==2){
      var inc = 1;
      do{
        var Neighbour = getNeighbours(Direction);
        var NoOfNbr = Neighbour.length;
        var IncorrectNbr =  Math.floor(Math.random()*NoOfNbr);
        //alert('Next Neighbour ' + NextNbr);
        var incorrect_x = inc_sx + Neighbour[IncorrectNbr][0];
        var incorrect_y = inc_sy + Neighbour[IncorrectNbr][1];
        if(incorrect_x >= 0 && incorrect_x < MazeLength){
          if(incorrect_y >= 0 && incorrect_y < MazeLength){
            Maze[incorrect_x][incorrect_y] = 2;
            inc_sx = Path[next+i][0];
            inc_sy = Path[next+i][1];
            inc = 0;
          }
        }
      }while(inc);
    }
    else{
      var x =  Path[next+i][0];
      var y = Path[next+i][1];
      if(VisualCue==1){ Maze[x][y] = 2;}
    }
    var cue_x = Cue[next+i][0];
    var cue_y = Cue[next+i][1]*-1;
    //alert('x' + cue_x +'y'+ cue_y);
    if(i<Level){
      AddSilence();
    }
    AddCueWave(cue_x,cue_y,1);
    drawMaze(Maze,MazeLength);
  }
  CurrentCuePos = CurrentCuePos + Level;
}
function playError(){
  var audio = new Audio("1.wav");
  //var audio = new Audio("error500ms.mp3");
  audio.load();
  audio.play();
}
function AddSilence(){
  Sounds.push(silencefile);
  //Sounds.push("silent.wav");
}
function AddCueWave(x,y,z){
  var data = new Array();
  var seconds = 0.5; //x==0?1:0.5;
  var frequencyHz = pitch[y+1];
  var amplitude = volume*z;
    //amplitude = x==0?0.25*amplitude:amplitude;
  var wave_sample=0;
  var j=0;
  for (var i = 0; i < rate * seconds;i++) {
    wave_sample = Math.round(128 + 127 * Math.sin(i * 2 * Math.PI * frequencyHz / rate)*amplitude);
    //setting the pan for each channel
    switch(x){
      case -1://left speaker
        data[j++] = wave_sample;//(0.5 - balance);
        data[j++] = 0;//(0.5 + balance);
        break;
      case 0://both
        data[j++] = wave_sample;//(0.5 - balance);
        data[j++] = wave_sample;//(0.5 + balance);
        break;
      case 1://right speaker
        data[j++] = 0;//(0.5 - balance);
        data[j++] = wave_sample;//0;//(0.5 + balance);
        break;

    }
  }
  var wave = new RIFFWAVE();   //riffwave variable
  wave.header.sampleRate = rate;
  wave.header.numChannels = 2;
  wave.header.bitsPerSample = 16;
  wave.Make(data);
  Sounds.push(wave.dataURI);
}
function playSounds(){
  startexp = false;
  var audioEl = document.getElementById('audio');
  audioEl.load();
  //audioEl.removeEventListener('ended', playSounds);
  //console.log("sound"+Sounds[counter]);
  if(Sounds[counter]){
    audioEl.src = Sounds[counter];
    audioEl.addEventListener('ended', playSounds);
    audioEl.play();
    //console.log("played"+Sounds[counter]);
    counter++;
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
function drawCorrectMaze(MazeLength,Path){
  var CrrMaze = new Array(MazeLength);
  for(var i = 0; i<MazeLength;i++){
    CrrMaze[i] = new Array(MazeLength);
    for(var j = 0; j<MazeLength;j++){
      CrrMaze[i][j] = 6;
    }
  }
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.height;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var BlockWidth = Math.ceil((width - 50 - 18 * MazeLength)/MazeLength);
  var BlockHeight = Math.ceil((height - 50 - 18 * MazeLength)/MazeLength);
  var BlockColor = ['Yellow','Black','Orange','Green','Red','Blue','White'];
  canvas.style.border = "black 5px solid";
  context.beginPath();
  CrrMaze[start_x][start_y] = 5;
  for(var i=0;i<Path.length;i++){
    var pos_x = Path[i][0];
    var pos_y = Path[i][1];
    CrrMaze[pos_x][pos_y] = 0;
  }
  //alert(MazeLength);
  var y = 40;
  for (var j = 0; j < MazeLength; j++){
    var x = 40;
    for (var i = 0; i < MazeLength; i++){
      if(CrrMaze[i][j] == 0 || CrrMaze[i][j] == 5){
        context.fillStyle = BlockColor[CrrMaze[i][j]];
        context.lineWidth = 1;
        context.strokeStyle = 'Black';
        context.fillRect(x, y , BlockWidth, BlockHeight);
        context.strokeRect(x, y , BlockWidth, BlockHeight);
      }
      x = x + BlockWidth + 18;
    }
    y = y + BlockHeight + 18;
  }
}
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};
function SetInstruction(IKey,Dir){
    AlertMessage = '';
    InsFile = '';
    console.log(IKey);
    switch(IKey){
        case 1: InsFile = InstructionFile.concat(Dir,'training.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Audio Error Feedback Training experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Audio Error Feedback Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
                AlertMessage = AlertMessage.concat('You will hear a Buzzing Sound as a Hint for Wrong Response.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 2: InsFile = InstructionFile.concat(Dir,'training.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Video Error Feedback experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Video Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
                AlertMessage = AlertMessage.concat('You will see a Red or Green Color as a Hint for Wrong/Right Response.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 3: InsFile = InstructionFile.concat(Dir,'training.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction User Directed Audio Training experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction User Directed Audio Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 4: InsFile = InstructionFile.concat(Dir,'training.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Unsupervised Audio Training experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Unsupervised Audio Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 5: InsFile = InstructionFile.concat(Dir,'training.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Audio Testing experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Audio Testing experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 6: InsFile = InstructionFile.concat(Dir,'testing.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Testing experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Testing experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;

        case 7: InsFile = InstructionFile.concat(Dir,'WM_1.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Working Memory experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Working Memory experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('You will hear 2-8 sounds, Remember the sounds and press the corresponding Keys\n');
                AlertMessage = AlertMessage.concat('Press Spacebar for Next set of sounds.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 8: InsFile = InstructionFile.concat('4Familiar.wav');
                if(Dir == 4){
                    AlertMessage = AlertMessage.concat('This is 4 direction Familiarization experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
                }
                else{
                    AlertMessage = AlertMessage.concat('This is 8 direction Familiarization experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
                    AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
                    AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
                }
                AlertMessage = AlertMessage.concat('You will hear 2-8 sounds, Remember the sounds and press the corresponding Keys\n');
                AlertMessage = AlertMessage.concat('Press Spacebar for Next set of sounds.\n');
                AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
                break;
        case 0: InsFile = InstructionFile.concat('NextMapEnter.wav');
                AlertMessage = AlertMessage.concat('Current Map is Finished.Press Enter for Next Map.');
                InsFlag = true;
                break;
        case -1: InsFile = InstructionFile.concat('ExpFinishThanks.wav');
                AlertMessage = AlertMessage.concat('Experiment Finished !! \nThank You For Participating ',USERID,'\nYou Took : ',(ExperimentTime/60).toFixed(3),' Minutes\n Have a Nice Day.');
                InsFlag = true;
                break;
    }
    Instructions.push(InsFile);
    console.log(AlertMessage);
    playInstruction();
}
function playInstruction(){
    var instructionEL = document.getElementById('instructionEL');
    instructionEL.load();
    if(Instructions[InsCounter]){
        instructionEL.src = Instructions[InsCounter];
        instructionEL.addEventListener('ended', playMap);
        instructionEL.play();
        InsFile = '';
        InsCounter++;
    }
}
function playMap(){
        alert(AlertMessage);
        startexp = true;
        var Key = ExperimentList[CurrentMode];
        if(Key == 8){
            InterStimulusInterval = ISIList[ISICounter];
            ISICounter++;
            InterStimulusInterval = InterStimulusInterval.toString();
            console.log('Key is 8'+InterStimulusInterval);
        }
        else{
            InterStimulusInterval = FamiliarISI;
            InterStimulusInterval = InterStimulusInterval.toString();
            Familirization = false;
        }
        console.log('In PlayInstruction Else Part, Experiment Key: '+ Key);
        setDisplayAndError(Key);
        console.log('RandomOrder '+RandomOrder +' CueLength '+Level+'Familirization '+Familirization);
        var MazeDiv = document.getElementById('MazeDiv');
        //console.log(DisplayGrid);
        if(DisplayGrid==0){
            MazeDiv.style.visibility = 'hidden'; // hide, but let the element keep its size

        }
        else{
            MazeDiv.style.visibility = 'visible';
        }
        CueLabels = [];
        InputLabels = [];
        InputTime = [];
        generateMaze();
        drawMaze(Maze,MazeLength);
        drawMetrics();
        drawControls(-1);
        NextCue();
        playSounds();
        CueTime =  new Date().getTime();

        /* if(InsFlag){
         NextCue();
         playSounds();
         CueTime =  new Date().getTime();
         }*/
}