//Video
let video;
let flippedVideo;
//Audio
let audio;
//Save Data Object
// var json = {};


//Video Label Initial
let labelVideo = "Capturing...";
//Audio Label Initial
let labelAudio = "Listening...";
//RTPC Label Initial
let labelRTPC = "RTPC...";
//Video Classifier
let ClassifierVideo; 1
//Audio Classifier
let ClassifierAudio;
//Trained Model & Data
var modelURLVideo = 'https://teachablemachine.withgoogle.com/models/2pcRAYXR/';
var modelURLAudio = 'https://teachablemachine.withgoogle.com/models/Dqd9HYGY/';

//Volume Slider
var slide;

//Buttons
var button_PlayPause;
var button_PostEvent;
var button_AddInput;
var button_AddSwitch;
var button_AddRTPC;
var button_Save;

//Selector
var sel_Event;
var sel_switchGroup;

//CheckBox
var checkbox_RTPC;


//Event Input
var classInput = new Array();
var eventInput = new Array();
var labelArray = new Array();
var eventArray = new Array();
var index_Event = 0;

//Switch Input
var switchGroup;
var switchClassInput = new Array();
var switchStateInput = new Array();
var labelSwitchArray = new Array();
var switchStateArray = new Array();
var index_Switch = 0;

//RTPC Input
var rtpcController = ['Up/Down', 'Rotate', 'Grab'];
var rtpcControllerInput = new Array();
var rtpcParameterInput = new Array();
var rtpcControllerArray = new Array();
var rtpcParameterArray = new Array();
var index_RTPC = 0;


// function saveButtonPressed() {
//   json.modelURL = modelURL;
//   json.index = index;
//   json.labelArray = labelArray;
//   json.eventArray = eventArray;

//   save(json, "saved.json");
// }


//===================================================================================================
function createClassInput(defaultClass) {
  classInput[index_Event] = createInput(defaultClass);
  classInput[index_Event].position(850, 330 + index_Event * 50);

  bindOnChangedInput();

  index_Event++;
}

function bindOnChangedInput() {
  //Context Passing
  var inputClassObject = classInput[index_Event];
  var l_index = index_Event;

  //Changed Callback Bind
  classInput[index_Event].changed(() => { labelArray[l_index] = inputClassObject.value(); });
}
//================================================================================================
function createEventSelector(eventList, index) {
  eventInput[index] = createSelect();
  eventInput[index].position(1050, 330 + index * 50);

  for (let j = 0; j < eventList.length; j++) {
    eventInput[index].option(eventList[j].name);
  }

  eventArray[index] = eventList[eventList.length - index - 1].name;
  bindOnChangedSelector(index);
}

function bindOnChangedSelector(index) {
  var eventIn = eventInput[index];

  eventInput[index].changed(() => { eventArray[index] = eventIn.value(); });
}
//================================================================================================
function createSwitchClassInput(defaultClass) {
  switchClassInput[index_Switch] = createInput(defaultClass);
  switchClassInput[index_Switch].position(850, 590 + index_Switch * 50);

  bindOnChangedSwitchInput();
  index_Switch++;
}

function bindOnChangedSwitchInput() {
  var inputClassObject = switchClassInput[index_Switch];
  var l_index = index_Switch;

  //Change Callback Bind
  switchClassInput[index_Switch].changed(() => { labelSwitchArray[index_Switch] = inputClassObject.value(); });
}
//=================================================================================================
function createSwitchSelector(index) {
  switchStateInput[index] = createSelect();
  switchStateInput[index].position(1050, 590 + index * 50);

  for (let j = 0; j < switchList.length; j++) {
    switchStateInput[index].option(switchList[j].name);

  }
  switchStateArray[index] = switchList[index].name;

  bindOnChangedSwitchSelector(index);
}

function bindOnChangedSwitchSelector(index) {
  var switchState = switchStateInput[index];

  switchStateInput[index].changed(() => { switchStateArray[index] = switchState.value(); });
}
//===============================================================================================
function createSwitchGroupSelector() {
  sel_switchGroup = createSelect();
  sel_switchGroup.position(900, 560);


  for (let j = 0; j < switchgroupList.length; j++) {
    sel_switchGroup.option(switchgroupList[j].name);
  }

  bindOnChangedSwitchGroupSelector();
}

function bindOnChangedSwitchGroupSelector() {

  sel_switchGroup.changed(() => { switchGroup = sel_switchGroup.value(); });
}
//==================================================================================================
function createRTPCSelector(index) {
  rtpcControllerInput[index] = createSelect();
  rtpcControllerInput[index].position(850, 800 + index_RTPC * 50);

  for (let j = 0; j < rtpcController.length; j++) {
    rtpcControllerInput[index].option(rtpcController[j]);
  }
  rtpcControllerArray[index] = rtpcControllerInput[index];

  bindOnChangedRTPCSelector(index);
}

function bindOnChangedRTPCSelector(index) {
  var controller = rtpcControllerInput[index];

  rtpcControllerInput[index].changed(() => { rtpcControllerArray[index] = controller.value(); });
}
//==================================================================================================
function createRTPCParamSelector(index) {
  rtpcParameterInput[index] = createSelect();
  rtpcParameterInput[index].position(1050, 800 + index_RTPC * 50);

  for (let j = 0; j < rtpcList.length; j++) {
    rtpcParameterInput[index].option(rtpcList[j].name);
  }

  rtpcParameterArray[index] = rtpcList[0].name;
  index_RTPC++;
  bindOnChangedRTPCParamSelector(index);
}

function bindOnChangedRTPCParamSelector(index) {
  var RTPC = rtpcParameterInput[index];

  rtpcParameterInput[index].changed(() => { rtpcParameterArray[index] = RTPC.value(); });

}
//==================================================================================================
function addButtonPressed(defaultClass) {
  createClassInput(defaultClass);
  createDiv();

  //Selector Construction Must After index_Event++
  createEventSelector(eventList, index_Event - 1);
}

function addSwitchButtonPressed(defaultClass) {
  createSwitchClassInput(defaultClass);
  createDiv();

  createSwitchSelector(index_Switch - 1);
}

function addRTPCButtonPressed() {
  createRTPCSelector(index_RTPC);
  createDiv();

  createRTPCParamSelector(index_RTPC);
}

function rtpcCheckboxChanged() {
  if (checkbox_RTPC.checked())
    console.log("On");
  else
    console.log("Off");
}

//=================================================================================
var bVideo = true;
//Button Pressed Func
function pauseVideo() {
  if (bVideo) {
    video.pause();
    bVideo = false;
  }
  else {
    video.play();
    bVideo = true;
  }
}

//============================Step 1: Load the model
function preload() {
  ClassifierVideo = ml5.imageClassifier(modelURLVideo + 'model.json');
  ClassifierAudio = ml5.soundClassifier(modelURLAudio + 'model.json');

  // json = loadJSON("saved.json");
}

//============================Step 2: classify the video
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  ClassifierVideo.classify(video, getVideoModelOutput);
}

function classifyAudio() {
  ClassifierAudio.classify(audio, getAudioModelOutput);
}

//============================Step 3 Get Model Output
function getVideoModelOutput(error, res) {
  if (error) {
    console.error(error);
    return;
  }

  labelVideo = res[0].label;
  classifyVideo();
}

function getAudioModelOutput(error, res) {
  if (error) {
    // console.error(error);
    return;
  }

  labelAudio = res[0].label;
  classifyAudio();
}


let wave;
//==============================Step 5: setup synthsis
function setupSynth(type, amp, freq) {
  wave.setType(type);
  wave.amp(amp);
  wave.freq(freq);
}

//Post Event
var bCanPlay = true;
var post = function (eventName) {
  console.log(eventName);
  PostEvent(eventName);
}

//Set Switch
var postSwitch = function (switchGroup, switchState) {
  // console.log(`${switchGroup} ${switchState}`);
  SetSwitch(switchGroup, switchState);
}

//Set RTPC
var postRTPC = function (rtpc, value) {
  // console.log(`${rtpc}, ${value}`);
  SetRTPC(rtpc, value);
}

var postTest = function () {
  PostEvent("Play_Test");
}


//Layout Setup
function setup() {
  //Video
  var canvas = createCanvas(720, 540);
  canvas.position(100, 205);
  video = createCapture(VIDEO);
  video.size(720, 540);
  video.hide();

  audio = createCapture(AUDIO);

  //Synth
  wave = new p5.Oscillator();
  setupSynth('sine', 1, 1000);
  isPlaying = false;

  //Volume slider
  var vol_Span = createSpan("Volume");
  vol_Span.position(100, 720);
  slide = createSlider(0, 2, 1, 0.01);
  slide.position(130, 720);
  slide.changed(function () { SetVol(slide.value()) });


  //Play/Stop button
  button_PlayPause = createButton('Video Play/Pause');
  button_PlayPause.position(680, 720);
  button_PlayPause.style("margin", 100);
  button_PlayPause.mousePressed(pauseVideo);

  //Post Event Demo
  button_PostEvent = createButton('Post Event');
  button_PostEvent.mousePressed(postTest);

  //Add Input Pair Button
  button_AddInput = createButton('Add More');
  button_AddInput.position(1200, 300);
  button_AddInput.mousePressed(addButtonPressed);

  //Add Switch Pair Button
  button_AddSwitch = createButton('Add Switch');
  button_AddSwitch.position(1280, 300);
  button_AddSwitch.mousePressed(addSwitchButtonPressed);

  //Add RTPC Pair Button
  button_AddRTPC = createButton('Add RTPC');
  button_AddRTPC.position(1370, 300);
  button_AddRTPC.mousePressed(addRTPCButtonPressed);

  //RTPC On/Off
  checkbox_RTPC = createCheckbox('On/Off', false);
  checkbox_RTPC.position(950, 770);
  checkbox_RTPC.changed(rtpcCheckboxChanged);

  //Save Data
  // button_Save = createButton("Save");
  // button_Save.mousePressed(saveButtonPressed);

  createDiv();
  //URL Input
  var videoModel_Span = createSpan("Video Model");
  videoModel_Span.position(850, 220);
  var videoModel_Input = createInput(modelURLVideo);
  videoModel_Input.position(980, 220)
  videoModel_Input.size(400);
  videoModel_Input.changed(function () { modelURLVideo = videoModel_Input.value() });

  var audioModel_Span = createSpan("Audio Model");
  audioModel_Span.position(850, 260);
  var audioModel_Input = createInput(modelURLAudio);
  audioModel_Input.position(980, 260)
  audioModel_Input.size(400);
  audioModel_Input.changed(function () { modelURLAudio = audioModel_Input.value() });


  var class_Span = createSpan("Class");
  class_Span.position(850, 300);

  var class_Span_02 = createSpan("Class");
  class_Span_02.position(850, 560);

  var event_span = createSpan("Event");
  event_span.position(1050, 300);

  var event_span_02 = createSpan("Switch");
  event_span_02.position(1050, 560);

  var rtpc_span = createSpan("Controller");
  rtpc_span.position(850, 770);

  var rtpc_span_02 = createSpan("RTPC");
  rtpc_span_02.position(1050, 770);

  createDiv();

  // labelArray = json['labelArray'];

  // for (var i = 0; i < json['index']; i++) {
  //   var index = i;
  //   addButtonPressed(labelArray[i]);
  // }

  //Three Default Event Label Class
  labelArray[0] = "One";
  labelArray[1] = "Two";
  labelArray[2] = "Three";

  //Two Defaulr Switch Label Class
  labelSwitchArray[0] = "Switch One";
  labelSwitchArray[1] = "Switch Two";


  //Create Default Event Input
  createClassInput(labelArray[0]);
  createClassInput(labelArray[1]);
  createClassInput(labelArray[2]);

  //Create Switch Group
  createSwitchGroupSelector();

  //Create Default Switch Input
  createSwitchClassInput(labelSwitchArray[0]);
  createSwitchClassInput(labelSwitchArray[1]);

  //ML Initial
  flippedVideo = ml5.flipImage(video);
  classifyVideo();
  classifyAudio();
}

//Store One Last Time's Event&Switch For Checking
var eventCache;
var switchCache;

//Main loop
function draw() {
  background(0);

  image(flippedVideo, 0, 0);

  //Draw the label
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(labelVideo, width / 2 - 90, height - 16);
  text(labelAudio, width / 2 + 100, height - 16);


  //Wave volume
  wave.amp(slide.value(), 0.5);

  //Post Event Loop
  for (let i = 0; i <= index_Event; i++) {
    if (labelVideo == labelArray[i]) {
      if (bCanPlay) {
        if (eventCache != eventArray[i]) {
          eventCache = eventArray[i];
          post(eventArray[i]);
        }
      }
    }
  }

  //Set Switch Loop
  for (let i = 0; i < index_Switch; i++) {
    if (labelAudio == labelSwitchArray[i]) {
      if (switchCache != switchStateArray[i]) {
        switchCache = switchStateArray[i];
        postSwitch(switchGroup, switchStateArray[i]);
        post(eventCache);
      }
    }
  }

  if (checkbox_RTPC.checked()) {
    //Set RTPC Loop
    for (let i = 0; i < rtpcParameterArray.length; i++) {
      switch (rtpcControllerArray[i]) {
        case 'Up/Down': postRTPC(rtpcParameterArray[i], paramUpDown);
          break;

        case 'Rotate': postRTPC(rtpcParameterArray[i], paramRotation);
          break;

        case 'Grab': postRTPC(rtpcParameterArray[i], paramGrab);
          break;
      }
    }
  }

}