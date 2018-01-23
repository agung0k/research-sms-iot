//int Status = 12;  // Digital pin D6
int sensor = 13;  // Digital pin D7
int pirState = LOW:
int val = 0;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  pinMode(sensor, INPUT);   // declare sensor as input
  //pinMode(Status, OUTPUT);  // declare LED as output
}

void loop() {
  // put your main code here, to run repeatedly:
  val = digitalRead(sensor);
  if(val == HIGH) {
    //digitalWrite (Status, HIGH);
    if(pirState == LOW){
      Serial.println("1");
      pirState = HIGH;
    }
  }
  else {
    if(pirState == HIGH){
    //digitalWrite (Status, LOW);
      Serial.println("0");
      pirState = LOW;
    }
  }
  delay(1000);
}
