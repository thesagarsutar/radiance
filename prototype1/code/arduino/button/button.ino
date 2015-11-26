#include <Button.h>

const int buttonPin = 2;
const int ledPin =  13;      // the number of the LED pin
const int notifyPin = 3;

int buttonState = 0;
int receivedData = 0;
int doubleClickDelay = 250;       //400 is the default

Button cameraButton = Button(buttonPin, LOW);

void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT);
  pinMode(notifyPin, OUTPUT);
  Serial.begin(9600);
  cameraButton.setDoubleClickDelay(doubleClickDelay);
}

void loop() {
    cameraButton.listen();
  // put your main code here, to run repeatedly:
  
    if (cameraButton.onPress()) {
      digitalWrite(ledPin, HIGH);
      notify(500);
      Serial.print("1");
    } else {
      digitalWrite(ledPin, LOW);
      //Serial.println("unpressed");
    }

//  Serial.flush();
//  while (Serial.available()) {
//    receivedData = (int)Serial.read();
//    //Serial.print("received Data:");
//    //Serial.println(receivedData);
//
//    for (int i = 0; i < 10; i++) {
//      digitalWrite(ledPin, HIGH);
//      delay(2000);
//      digitalWrite(ledPin, LOW);
//      delay(2000);
//    }
//  }

  delay(1);
}

void notify(int delayTime) {
  digitalWrite(notifyPin, HIGH);
  delay(delayTime);
  digitalWrite(notifyPin, LOW);
  delay(delayTime);
}

