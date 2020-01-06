// to make working with angles easy
window.TO_RAD = Math.PI / 180;
window.TO_DEG = 1 / TO_RAD;

//Parameter From Hands Rotation 0 ~ 1
var paramRotation;
//Parameter From Hands Grabbing 0 ~ 1
var paramGrab;
//Parameter From Hands Up.Down 0~ 1
var paramUpDown;

Leap.loop({}, function (frame) {
    if (frame.hands.length > 0) {
        //Rotation Sensor
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];

            var rotation = Math.round(hand.roll() * TO_DEG);
            var grab = 0;
            var height = 0;

            if (hand.type == "left") {
                // 0 ~ 180 Degree
                if (rotation < 10)
                    rotation = 0;
                else if (rotation > 170)
                    rotation = 180;

                //Mapping Range
                rotation = mapRange([0, 180], [0, 1], rotation);
                paramRotation = rotation;
            }
            else if (hand.type == "right") {
                //0 ~ -180 Degrees
                if (rotation > 10)
                    rotation = 0;
                else if (rotation < -170)
                    rotation = -180;

                //Mapping Range
                rotation = mapRange([0, -180], [0, 1], rotation);
                paramRotation = rotation;
            }

            //Grabbing Sensor
            if (hand) {
                var dot = Leap.vec3.dot(hand.direction, hand.indexFinger.direction);
                grab = dot.toPrecision(2);
                grab = mapRange([-1, 1], [0, 1], grab);
            }

            //Up Down Sensor
            if (hand) {
                height = hand.arm.center()[1];
                if (height < 40)
                    height = 40;
                else if (height > 400)
                    height = 400;

                height = mapRange([40, 400], [0, 1], height);
            }

            paramGrab = grab;
            paramUpDown = height;
            // console.log(`Rotation: ${paramRotation} Grab: ${paramGrab} UpDown: ${paramUpDown}`);
        }
    }
});

function mapRange(from, to, num) {
    return to[0] + (num - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};