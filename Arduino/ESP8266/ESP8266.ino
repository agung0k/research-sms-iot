#include <SoftwareSerial.h>
 
SoftwareSerial esp8266(3, 2); // Membuat RX Arduino menjadi pin 2 dan TX pin 3
                              
void setup(){                              
  Serial.begin(115200);
  esp8266.begin(115200); 
}
 
void loop()
{
  if(esp8266.available()) // Mengecek apakah ESP mengirimkan pesan
  {
    while(esp8266.available())
    {
      // Data ESP akan ditampikan pada output serial window
      char c = esp8266.read(); // Membaca karakter selanjutnya.
      Serial.write(c);
    }  
  }
  
 
  
  if(Serial.available())
  {
    // Delay digunakan untuk mengatur waktu pengiriman karakter
    delay(500); 
    
    String command="";
    
    while(Serial.available()) // membaca perintah karakter by karakter
    {
        // membaca satu karakter
      command+=(char)Serial.read();
    }
    esp8266.println(command); // mengirim karakter yang terpaca kepada ESP
  }
}
