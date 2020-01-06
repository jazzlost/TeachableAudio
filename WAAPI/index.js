var showMessage = function (message) {
    document.getElementById("message").innerHTML = message;
}

var showProjectInfo = function (projectName) {
    document.getElementById("projectName").innerHTML = projectName;
}

var eventList = new Array();
var switchgroupList = new Array();
var switchList = new Array();
var rtpcList = new Array();

//Globe Connection Object
var connection;

function onBodyLoad() {
    // Create the WAMP connection
    connection = new autobahn.Connection({
        url: 'ws://localhost:8080/waapi',
        realm: 'realm1',
        protocols: ['wamp.2.json']
    });

    // Setup handler for connection closed
    connection.onclose = function (reason, details) {
        showMessage('wamp connection closed');
        return true;
    };

    // Setup handler for connection opened
    connection.onopen = function (session) {
        showMessage('wamp connection opened');

        // Call getInfo
        session.call(ak.wwise.core.getInfo, [], {}).then(
            function (res) {
                showMessage(`Hello ${res.kwargs.displayName} ${res.kwargs.version.displayName}`);
            },
            function (error) {
                showMessage(`error: ${error}`);
            }
        );

        //Display Project Name
        var projectName =
        {
            "from":
            {
                "ofType": ["Project"]
            }
        };
        var projectOption =
        {
            "return": [
                "name",
                "filePath"
            ]
        }
        session.call(ak.wwise.core.object.get, [], projectName, projectOption).then(
            function (res) {
                showProjectInfo(`${res.kwargs.return[0].name}`);
            },
            function (error) {
                showProjectInfo(`Error: ${error}`);
            }
        );

        //Create Listener Object
        var WAAPI_Listener =
        {
            "name": "WAAPI_Listener",
            "gameObject": 1
        };
        session.call(ak.soundengine.registerGameObj, [], WAAPI_Listener);

        //Set Listener Object as Default Listener
        var defaultListeners =
        {
            "listeners": [1]
        }
        session.call(ak.soundengine.setDefaultListeners, [], defaultListeners);

        //Get Event List & SwitchGroup
        var eventQuery =
        {
            from:
            {
                ofType: ['Event', 'SwitchGroup', 'Switch', 'GameParameter']
            }
        };
        var eventOption =
        {
            return: ['name', 'type']
        };
        session.call('ak.wwise.core.object.get', [], eventQuery, eventOption).then(
            function (res) {
                for (var i = 0; i < res.kwargs.return.length; i++) {
                    if (res.kwargs.return[i].type == 'Event') {
                        eventList.push(res.kwargs.return[i]);
                    }
                    else if (res.kwargs.return[i].type == 'SwitchGroup') {
                        switchgroupList.push(res.kwargs.return[i])
                    }
                    else if (res.kwargs.return[i].type == 'Switch') {
                        switchList.push(res.kwargs.return[i]);
                    }
                    else if (res.kwargs.return[i].type == 'GameParameter') {
                        rtpcList.push(res.kwargs.return[i]);
                    }
                }

                for (var i = 0; i < index_Event; i++) {
                    createEventSelector(eventList, i);
                }

                createSwitchGroupSelector();
                switchGroup = switchgroupList[0].name;

                createSwitchSelector(0);
                createSwitchSelector(1);

                switchStateArray[0] = switchList[0].name;
                switchStateArray[1] = switchList[1].name;

                createRTPCSelector(0);
                rtpcControllerArray[0] = "Up/Down";
                createRTPCParamSelector(0);
                rtpcParameterArray[0] = rtpcList[0].name;

            },
            function (error) {
                console.log('error: ${error}');
            }
        )
    };
    // Open the connection
    connection.open();
};

// //Posting Event
function PostEvent(eventName) {
    var Event =
    {
        "event": eventName,
        "gameObject": 1
    };
    connection.session.call(ak.soundengine.postEvent, [], Event).then(
        function (res) {
            console.log(`PlayingID: ${res.kwargs.return}`);
        },
        function (error) {
            console.log(`error: ${error.return}`);
        }
    );
};

//Set Volume
function SetVol(volume) {
    var volumeObject = {
        "listener": 1,
        "emitter": 1,
        "controlValue": volume
    };

    connection.session.call(ak.soundengine.setGameObjectOutputBusVolume, [], volumeObject);
};

//Set Switch
function SetSwitch(switchGroup, switchState) {
    var switchObject = {
        "gameObject": 1,
        "switchGroup": switchGroup,
        "switchState": switchState
    };

    connection.session.call(ak.soundengine.setSwitch, [], switchObject);
};

//Set RTPC
function SetRTPC(rtpc, value) {
    var rtpcObject = {
        "gameObject": 1,
        "rtpc": rtpc,
        "value": value
    };

    connection.session.call(ak.soundengine.setRTPCValue, [], rtpcObject);
};