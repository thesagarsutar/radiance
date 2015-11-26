#include <Button.h>

const int buttonPin = 2;
const int ledPin =  13;      // the number of the LED pin
const int notifyPin = 3;

int buttonState = 0;
char receivedData;
int doubleClickDelay = 250;       //400 is the default

Button cameraButton = Button(buttonPin, LOW);

void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT);
  pinMode(notifyPin, OUTPUT);
  Serial.begin(9600);
  // cameraButton.setDoubleClickDelay(doubleClickDelay);
}

void loop() {
  cameraButton.listen();
  // put your main code here, to run repeatedly:

  if (cameraButton.onPress()) {
    Serial.write("1");
    digitalWrite(ledPin, HIGH);
    notify(500);

  } else {
    digitalWrite(ledPin, LOW);
    //Serial.println("unpressed");
  }

  Serial.flush();
  while (Serial.available()) {
    receivedData = char(Serial.read());
    //Serial.print("received Data:");
    //Serial.write(receivedData);
    if (receivedData == '1') {
      for (int i = 0; i < 5; i++) {
//        digitalWrite(ledPin, HIGH);
//        delay(1000);
//        digitalWrite(ledPin, LOW);
//        delay(1000);
        //Serial.println(receivedData);
        notify(1000);
      }
    }

  }

  delay(1);
}

void notify(int delayTime) {
  digitalWrite(notifyPin, HIGH);
  delay(delayTime);
  digitalWrite(notifyPin, LOW);
  delay(delayTime);
}

