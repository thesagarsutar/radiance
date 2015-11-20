const int buttonPin = 2;
const int ledPin =  13;      // the number of the LED pin

int buttonState = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  buttonState = digitalRead(buttonPin);

  if(buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);
    Serial.print("1");
  }else{
    digitalWrite(ledPin, LOW);
    //Serial.println("unpressed");
  }
  delay(3);
}
