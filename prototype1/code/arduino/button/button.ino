const int buttonPin = 2;
const int ledPin =  13;      // the number of the LED pin

int buttonState = 0;
int receivedData = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
    buttonState = digitalRead(buttonPin);
  
    if (buttonState == HIGH) {
      digitalWrite(ledPin, HIGH);
      Serial.print("1");
    } else {
      digitalWrite(ledPin, LOW);
      //Serial.println("unpressed");
    }
  
  if (Serial.available()) {
    receivedData = (int)Serial.read();
    Serial.print("received Data:");
    Serial.println(receivedData);

    for (int i = 0; i < 10; i++) {
      digitalWrite(ledPin, HIGH);
      delay(2000);
      digitalWrite(ledPin, LOW);
      delay(2000);
    }
  }

  delay(200);
  Serial.flush();
}
