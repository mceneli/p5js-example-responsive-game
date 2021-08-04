//örnekte mouse karenin içerisinden çıktığında obje taşınamaz hale geliyor o sorunu kareyi dragged diye değişken ile tutup farenin hızlı çekilmesi durumunda da kopukluk yaşanmasını önledim.
//kare objelerinin saklanıldığı array.
var arr = new Array();

//locs arrayi kareleri yerleştirilecek eşit aralıklı grid alanının koordinatlarını tutar.
var locs = new Array();

/*places arrayi grid alanlarının dolu mu boş mu olduğunu saklar default olarak şu şekildedir: 1 1 1 1 1 1 1
ikinci kare tutulduğunda ikinci alan boşalacağından array şu hale gelir: 1 0 1 1 1 1 1
*/
var places = new Array();

var w = window.innerWidth;
var h = window.innerHeight;  

//döngülerde kullanılan indisler.
let i=0;
let j=0;
let k=0;

//kare sayısı: örneğin 10 olarak değiştirildiğinde 3 obje otomatik eklenir, yani 10 aynı sistemde 10 tane kare üretilir. 
let n=7;

//karelerin renklerini tutmak için kullanılan değişken.
let c;

let drag=0;
let temp=0;

//karelerin pürüzsüz kayması için hız katsayısı.
let ease=0.2;

//kareyi mouse ile tuttuğum konum ve sürüklediğim konumlar.
let draggedplace;
let nearestplace;

function setup() {
  createCanvas(w, h);
  
  for(i=0;i<n;i++){
    c = color(random(0,255), random(0,255), random(0,255));
    arr.push(new Square((i+1)*(w/(n+1)), h/2, c, i+1));
    locs.push( (i+1) * (w / (n+1) ) );
    places.push(1);
  }
}

function draw() {
  w=window.innerWidth;
  h=window.innerHeight;
  resizeCanvas(w, h);
  
  background(0);
//tüm karelerin görüntüleme ve kaydırma fonksiyonlarını çağırır.
  for(i=0; i<n; i++){
    arr[i].display((i+1)*(w/(n+1)),h/2);
    arr[i].easing();
    arr[i].ty=h/2;
  }
  
//farede sol tık tıklatıldığında tüm karelerin clicking adlı local fonksiyonları çağırılır. Bu fonksiyon karenin kendi üzerine tıklanıp tıklanılmadığını anlar.
  if (mouseIsPressed) {
    if (mouseButton == LEFT) {
      if(drag==0){
        for(i=0;i<arr.length;i++){
          arr[i].clicking();
        }
      }
    }  
    
    for(i=0;i<arr.length;i++){
      if(arr[i].dragged==1){
//tıklanan karenin merkezinin koordinatlarını fare koordinatlarına eşitler.
        arr[i].x=mouseX-w/30;
        arr[i].y=mouseY-w/30;
        
//taşınan kare diğer noktalara çok yaklaşırsa ona yer açıp karenin konumunu oraya güncelleyen kısım.
        for(j=0;j<arr.length;j++){
          if(dist(mouseX, mouseY, locs[j]+w/30, h/2+w/30)<w/20){
            nearestplace=j+1;
            arr[i].place=nearestplace;
            for(k=0;k<arr.length;k++){
              arr[k].slideLeft();
            }
            for(k=arr.length-1;k>=0;k--){
              arr[k].slideRight();
            }   
            draggedplace=nearestplace;

            }     
          }         
        }
      }
    }
}

//karelerin sınıfı
class Square{
  constructor(x,y,c,place){
    this.x = x;
    this.y = y;
    this.color=c;
    this.dragged=0;
    this.tx=x;
    this.ty=y;
    this.place=place;
  }
  
  display(){
    rect(this.x,this.y,w/15,w/15,w/50);
    fill(this.color);
  }
//karenin üzerine tıklanıldıysa anlamasını sağlayan fonksiyon
  clicking(){
    let d = dist(mouseX, mouseY, this.x+w/30, this.y+w/30);
    
    if(d<w/30){
      this.dragged=1;
      drag=1;
      draggedplace=this.place;
      places[this.place-1]=0;
    } 
  }
  
// karelerin ayarlanan konuma pürüzsüz bir şekilde kaymasını sağlayan fonksiyon
  easing(){
    this.tx=(this.place)*(w/(n+1));
    let dx = this.tx - this.x;
    this.x += dx * ease;
    
    let dy = this.ty - this.y;
    this.y += dy * ease;
  }
  
  slideLeft(){
    if(this.place>draggedplace && this.place<=nearestplace && this.dragged==0 && places[this.place-2]==0){
      this.place-=1;
      places[this.place-1]=1;
      places[this.place]=0;
    }
  }
  
  slideRight(){
    if(this.place<draggedplace && this.place>=nearestplace && this.dragged==0 && places[this.place]==0){
      this.place+=1;
      places[this.place-1]=1;
      places[this.place-2]=0;
    }
  }
  
}

//pencere yeniden boyutlandırıldığında canvas alanını yeniden boturlandırır.
function windowResized() {
  resizeCanvas(w, h);
}

//fare bırakıldığında tüm karelerin taşınıldığı anlamına gelen dragged değişkeni sıfırlanır.
function mouseReleased() {
  drag=0;
  for(i=0;i<arr.length;i++){
    if(arr[i].dragged){
      places[arr[i].place-1]=1;
    }
    arr[i].dragged=0;
  }
}
