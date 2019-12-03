Function.prototype.member = function(name, value){
   this.prototype[name] = value
}

//////// Game Definition

function Game(){}
Game.start = function(room, welcome){
   game.start(room.id)
   printMessage(welcome)
}
Game.end = function(){
   game.clear()
}
Game.move = function(room){
   game.move(room.id)   
}
Game.handItem = function(){
   return game.getHandItem()
}
Game.combination = function(combination1, combination2, result) {
   game.makeCombination(combination1.id, combination2.id, result.id)
}
Game.setGameoverMessage = function(){
    game.setGameoverMessage("꼬리칸의 반란은 허무하게 끝나고 말았다...")
}
Game.setTimer = function() {
    game.setTimer("7", "1", "초")
}
Game.hideTimer = function() {
    game.hideTimer()
}

//////// Room Definition

function Room(name, background){
   this.name = name
   this.background = background
   this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
   this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
   this.room = room
   this.name = name
   this.image = image

   if (room !== undefined){
      this.id = room.id.createObject(name, image)
   }
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
   this.image = image
   this.id.setSprite(image)
})
Object.member('resize', function(width){
   this.id.setWidth(width)
})
Object.member('setDescription', function(description){
   this.id.setItemDescription(description)
})

Object.member('getX', function(){
   return this.id.getX()
})
Object.member('getY', function(){
   return this.id.getY()
})
Object.member('locate', function(x, y){
   this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
   this.id.moveX(x)
   this.id.moveY(y)
})

Object.member('show', function(){
   this.id.show()
})
Object.member('hide', function(){
   this.id.hide()
})
Object.member('open', function(){
   this.id.open()
})
Object.member('close', function(){
   this.id.close()
})
Object.member('lock', function(){
   this.id.lock()
})
Object.member('unlock', function(){
   this.id.unlock()
})
Object.member('isOpened', function(){
   return this.id.isOpened()
})
Object.member('isClosed', function(){
   return this.id.isClosed()
})
Object.member('isLocked', function(){
   return this.id.isLocked()
})
Object.member('pick', function(){
   this.id.pick()
})
Object.member('isPicked', function(){
   return this.id.isPicked()
})

Object.member('isHanded', function(){
	return Game.handItem() == this.id
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
   Object.call(this, room, name, closedImage)

   // Door properties
   this.closedImage = closedImage
   this.openedImage = openedImage
   this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
   if (!this.id.isLocked() && this.id.isClosed()){
      this.id.open()
   } else if (this.id.isOpened()){
      if (this.connectedTo !== undefined){
         Game.move(this.connectedTo)
      }
      else {
         Game.end()
      }
   } else if(this.id.isLocked()) {
      printMessage('잠겨있다.')
   }
})
Door.member('onOpen', function(){
   this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
   this.id.setSprite(this.closedImage)
})

//////// Drawer Definition

function Drawer(room, name, closedImage, openedImage){
   Object.call(this, room, name, closedImage)

   // Drawer properties
   this.closedImage = closedImage
   this.openedImage = openedImage
}
// inherited from Object
Drawer.prototype = new Object()

Object.member('onClick', function() {
   if(this.id.isClosed()) {
      this.id.open()
   } else if(this.id.isOpened()) {
      this.id.close()
   } else if(this.id.isLocked()) {
      printMessage('잠겨있다.')
   }
})
Object.member('onOpen', function() {
   this.id.setSprite(this.openedImage)
})
Object.member('onClose', function() {
   this.id.setSprite(this.closedImage)
})

//////// Keypad Definition

function Keypad(room, name, image, password, callback){
   Object.call(this, room, name, image)

   // Keypad properties
   this.password = password
   this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
   showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition

function DoorLock(room, name, image, password, door, message){
   Keypad.call(this, room, name, image, password, function(){
      printMessage(message)
      door.unlock()
   })
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
   Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
   this.id.pick()
})
Item.member('isHanded', function(){
   return Game.handItem() == this.id
})

//////// Box Definition

function Box(room, name, closedImage, openedImage){
    Object.call(this, room, name, closedImage)
 
    // Box properties
    this.closedImage = closedImage
    this.openedImage = openedImage
 }
 // inherited from Object
 Box.prototype = new Object()
 
 Box.member('onClick', function() {
    if(this.id.isClosed()) {
       this.id.open()
    } else if(this.id.isOpened()) {
       this.id.close()
    }
 })
 Box.member('onOpen', function() {
    this.id.setSprite(this.openedImage)
 })
 Box.member('onClose', function() {
    this.id.setSprite(this.closedImage)
 })

 //////// Go Definition

function Go(room, name, image, connectedTo){
   Object.call(this, room, name, image)

    // Go properties
   this.connectedTo = connectedTo
}

// inherited from Object
Go.prototype = new Object()

Go.member('onClick', function(){
   Game.move(this.connectedTo)
})

//////// MsgObj Definition

function MsgObj(room, name, image, message){
    Object.call(this, room, name, image)
 
    // MsgObj properties
    this.message = message }
 // inherited from Object
 MsgObj.prototype = new Object()
 
 MsgObj.member('onClick', function() {
    printMessage(this.message)
 })

//////// Soldier Definition

function Soldier(room, name, image, deadImage, count, item){
   Object.call(this, room, name, image)

   this.deadImage = deadImage
   this.count = count
   this.item = item
}

// inherited from Object
Soldier.prototype = new Object()

Soldier.member('onClick', function(){
   if (this.item.isHanded()){
      playSound("퍽!.wav")
      if (this.id.isClosed() && this.count < 2) {
         this.count += 1
         printMessage("휘두른 드럼통에 병사가 맞았다!")
      } else if (this.id.isClosed() && this.count == 2){
         this.id.open()
      } else {
         printMessage("윌포드의 병사가 죽어 있다.") 
      }
   } else {
      printMessage("째깍째깍...")
   }
})

Soldier.member('onOpen', function(){  // 죽음
    this.id.setSprite(this.deadImage)
    kill += 1
    printMessage("윌포드의 병사가 죽었다.")
    this.room.id.locateObject(this.id, this.id.getX(), this.id.getY()+120)
})



//////////createRoom//////////
tail = new Room('tail', '꼬리칸.png')      // 변수명과 이름이 일치해야 한다.
jail = new Room('jail', '감옥.png')      // 변수명과 이름이 일치해야 한다.

tunnel_dark = new Room("tunnel_dark", "bg_black.png")
tunnel_nv = new Room("tunnel_nv", "bg_tunnel_green.jpg")
tunnel_door = new Room("tunnel_door", "bg_infrontofDoor_green.png")
kindergarten = new Room("kindergarten", "bg_kindergarten.png")

unclearroom = new Room('unclearroom', '흔들리는배경.png')
frontroom = new Room('frontroom', '윌포드전방.jpg')
lastroom = new Room('lastroom', '배경112.png')
enginroom = new Room('enginroom', '엔진룸.png')   
endroom = new Room('endroom', '불난방.png')      

//////////tail//////////
tail.door1 = new Door(tail, 'door1', '꼬리칸_닫힘.png', '꼬리칸_열림.png', jail)
tail.door1.resize(150)
tail.door1.locate(180, 440)
tail.door1.lock()

tail.door1.broken = false
tail.door1.onClick = function() {
   if(tail.door1.isOpened()) {
      Game.move(jail)
   } else {
      printMessage('단단하게 잠겨있다.')
   }
   if(tail.drum3.isHanded()) {
      tail.door1.setSprite('꼬리칸_열림.png')
      tail.door1.open()
      if(!tail.door1.broken) {
         showVideoPlayer('break.mp4')
         tail.door1.broken = true
      }

   }
}

tail.bunk1 = new Object(tail, 'bunk1', 'bunk.png')
tail.bunk1.resize(200)
tail.bunk1.locate(530, 480)

tail.bunk2 = new Object(tail, 'bunk2', 'bunk.png')
tail.bunk2.resize(280)
tail.bunk2.locate(720, 500)

tail.gilliam = new Object(tail, 'gilliam', '길리엄.png')
tail.gilliam.resize(120)
tail.gilliam.locate(710, 480)
tail.gilliam.hide()

tail.bunk2.onClick = function() {
   tail.gilliam.show()
}

tail.cart = new Object(tail, 'cart', 'cart1.png')
tail.cart.resize(180)
tail.cart.locate(350, 490)

tail.protein = new Item(tail, 'protein', '양갱.png')
tail.protein.resize(110)
tail.protein.locate(360, 510)

tail.protein.onClick = function() {
   if(tail.gilliam.talk1) {
      tail.protein.pick()
   } else {
      printMessage('오늘 배급받을 단백질 블럭')
   }
}

tail.Note = new Item(tail, 'Note', 'Note1.png')
tail.Note.hide()

tail.drum1 = new Item(tail, 'drum1', 'drum1.png')
tail.drum1.resize(150)
tail.drum1.locate(700, 612)

tail.drum1.onClick = function() {
   if(tail.gilliam.talk2) {
      tail.drum1.pick()
   } else {
      printMessage('드럼통이다.')
   }
}

tail.drum2 = new Item(tail, 'drum2', 'drum2.png')
tail.drum2.resize(100)
tail.drum2.locate(100, 552)

tail.drum2.onClick = function() {
   if(tail.gilliam.talk2) {
      tail.drum2.pick()
   } else {
      printMessage('튼튼하군!')
   }
}

tail.drum3 = new Item(tail, 'drum3', 'drum3.png')
tail.drum3.hide()

Game.combination(tail.drum1, tail.drum2, tail.drum3)

tail.cabinet1 = new Drawer(tail, 'cabinet1', '캐비닛-오른쪽-닫힘.png', '캐비닛-오른쪽-열림.png')
tail.cabinet1.resize(120)
tail.cabinet1.locate(900, 500)

tail.cabinet2 = new Drawer(tail, 'cabinet2', '캐비닛-오른쪽-닫힘.png', '캐비닛-오른쪽-열림.png')
tail.cabinet2.resize(130)
tail.cabinet2.locate(1000, 510)

tail.cabinet3 = new Drawer(tail, 'cabinet3', '캐비닛-오른쪽-닫힘.png', '캐비닛-오른쪽-열림.png')
tail.cabinet3.resize(140)
tail.cabinet3.locate(1100, 520)

tail.knife = new Item(tail, 'knife', '칼.png')
tail.knife.resize(100)
tail.knife.locate(960, 500)
tail.knife.hide()

tail.cabinet2.onOpen = function() {
    tail.cabinet2.setSprite("캐비닛-오른쪽-닫힘.png")
    tail.knife.hide()
}
tail.cabinet2.onClose = function() {
    tail.cabinet2.setSprite("캐비닛-오른쪽-열림.png")
    tail.knife.show()
}

// tail.bettary = new Item(tail, 'bettary', '건전지.png')
// tail.bettary.resize(40)
// tail.bettary.locate(875, 540)
// tail.bettary.hide()

// tail.key = new Item(tail, 'key', '열쇠.png')
// tail.key.resize(40)
// tail.key.locate(875, 620)
// tail.key.hide()

tail.cabinet1.onOpen = function() {
    tail.cabinet1.setSprite("캐비닛-오른쪽-닫힘.png")
   tail.bettary.hide()
   tail.key.hide()
}
tail.cabinet1.onClose = function() {
    tail.cabinet1.setSprite("캐비닛-오른쪽-열림.png")
   tail.bettary.show()
   tail.key.show()
}

// tail.pepper = new Item(tail, 'pepper', '페퍼로니.png')
// tail.pepper.resize(50)
// tail.pepper.locate(1070, 500)
// tail.pepper.hide()

tail.cabinet3.onOpen = function() {
    tail.cabinet3.setSprite("캐비닛-오른쪽-닫힘.png")
   tail.pepper.hide()
}
tail.cabinet3.onClose = function() {
    tail.cabinet3.setSprite("캐비닛-오른쪽-열림.png")
   tail.pepper.show()
}

Game.combination(tail.protein, tail.knife, tail.Note)

var click = 0;
var click1 = 0;
tail.gilliam.talk1 = false
tail.gilliam.talk2 = false
tail.gilliam.onClick = function() {
   if(tail.Note.isHanded()) {
      if(click1 == 0) {
         printMessage('길리엄: 어디보자...(계속 클릭)')
         tail.gilliam.talk2 = true
         click1 += 1
      } else if(click1 == 1) {
         printMessage('길리엄: 남궁...민수?(계속 클릭)')
         click1 += 1
      } else if(click1 == 2) {
         printMessage('길리엄: 그는 이 열차 최고의 암호 전문가지. 아마 그를 찾으면 앞칸으로 갈 수 있을거야.(계속 클릭)')
         click1 += 1
      } else if(click1 == 3) {
         printMessage('길리엄: 그 전에 바로 앞에 저 문부터 뚫어야 할텐데...(계속 클릭)')
         click1 += 1
      } else if(click1 == 4) {
         printMessage('길리엄: 자네들끼리 힘을 합쳐서 저 문을 뚫어보게!(계속 클릭)')
         click1 += 1
      } else if(click1 == 5) {
         printMessage('꼬리칸의 사람들끼리 힘을 합쳐야 다음 칸으로 탈출할 수 있습니다.')
         click1 += 1
      } else if(click1 == 6) {
         printMessage('길리엄: 저 드럼통들을 붙여보는게 어떤가?')
      }
   } else {
      if(click == 0) {
         printMessage('길리엄: 불렀는가?(계속 클릭)')
         tail.gilliam.talk1 = true
         click += 1
      } else if(click == 1) {
         printMessage('길리엄: 꼬리칸을 탈출하여 반란을 일으킨다고?(계속 클릭)')
         click += 1
      } else if(click == 2) {
         printMessage('길리엄: 쉽지 않을거야... 한 사람의 도움이 필요할걸세(계속 클릭)')
         click += 1
      } else if(click == 3) {
         printMessage('길리엄: 우선 쪽지가 필요해...(계속 클릭)')
         click += 1
      } else if(click == 4) {
         printMessage('앞칸에서 보내온 쪽지를 찾아 길리엄에게 보여주세요')
         click += 1
      } else if(click == 5 ) {
         printMessage('길리엄: 쪽지는 아직인가?')
         click += 1
      } else if(click == 6) {
         printMessage('길리엄: 단백질 블럭에 속에 들어있다는 소문은 들었는데...')
         click -= 1
      }
   }
}

//////////jail//////////
jail.door1 = new Door(jail, 'door1', '문2-좌-닫힘.png', '문2-좌-열림.png', tunnel_dark)
jail.door1.resize(100)
jail.door1.locate(350, 300)
jail.door1.lock()
jail.door1.video = 0  // 최초 1회만 비디오 실행
jail.door1.onClick = function() {
   if(!this.id.isLocked() && jail.door1.video == 0){
      Game.move(this.connectedTo)
      showVideoPlayer("tunnel_intro.mp4")
      jail.door1.video = 1
   } else if (!this.id.isLocked() && jail.door1.video == 1){
      Game.move(this.connectedTo)
   } else {
      printMessage("잠겨있다.")
   }
}

jail.lock1 = new DoorLock(jail, 'lock1', '키패드.png', '2022', jail.door1, '문이 열린다.')
jail.lock1.resize(80)
jail.lock1.locate(420, 290)

jail.door2 = new Door(jail, 'door2', '화살표.png', '화살표.png', tail)
jail.door2.resize(80)
jail.door2.locate(1200, 230)

jail.number1 = new Object(jail, 'number1', 'number1.png')
jail.number1.resize(40)
jail.number1.locate(1140, 190)

jail.number2 = new Object(jail, 'number2', 'number2.png')
jail.number2.resize(40)
jail.number2.locate(870, 160)

jail.number3 = new Object(jail, 'number3', 'number3.png')
jail.number3.resize(40)
jail.number3.locate(630, 120)

jail.jail1 = new Drawer(jail, 'jail1', '감옥_닫힘.png', '감옥_열림.png')
jail.jail1.resize(200)
jail.jail1.locate(1100, 410)
jail.jail1.lock()

jail.keypad1 = new Keypad(jail, 'keypad1', '키패드-우.png', '1234', function() {
   printMessage('감옥1: 암호 해제.')
   jail.jail1.unlock()
}) 
jail.keypad1.resize(20)
jail.keypad1.locate(1140, 250)

jail.jail2 = new Drawer(jail, 'jail2', '감옥_닫힘.png', '감옥_열림.png')
jail.jail2.resize(190)
jail.jail2.locate(840, 370)
jail.jail2.lock()

jail.keypad2 = new Keypad(jail, 'keypad2', '키패드-우.png', '3456', function() {
   printMessage('감옥2: 암호 해제.')
   jail.jail2.unlock()
}) 
jail.keypad2.resize(20)
jail.keypad2.locate(870, 220)

jail.jail2.onOpen = function() {
    jail.jail2.setSprite("감옥_닫힘.png")
}
jail.jail2.onClose = function() {
   jail.jail2.setSprite("감옥_열림.png")
   if(jail.kronole.isHanded()){
      jail.NGMS.show()
   } else {
      printMessage('남궁민수를 발견했다. 하지만 그는 일어나지 않는다.')
   }
}

jail.jail3 = new Drawer(jail, 'jail3', '감옥_닫힘.png', '감옥_열림.png')
jail.jail3.resize(180)
jail.jail3.locate(590, 310)
jail.jail3.lock()

jail.keypad3 = new Keypad(jail, 'keypad3', '키패드-우.png', '5678', function() {
   printMessage('감옥3: 암호 해제.')
   jail.jail3.unlock()
}) 
jail.keypad3.resize(20)
jail.keypad3.locate(630, 170)

// jail.translator1 = new Item(jail, 'translator1', '번역기.png')
// jail.translator1.resize(30)
// jail.translator1.locate(730, 220)

jail.translator2 = new Item(jail, 'translator2', '번역기.png')
jail.translator2.resize(30)
jail.translator2.locate(750, 280)

// jail.translator3 = new Item(jail, 'translator3', '번역기.png')
// jail.translator3.resize(30)
// jail.translator3.locate(710, 270)

jail.NGMS = new Object(jail, 'NGMS', '남궁민수.png')
jail.NGMS.resize(200)
jail.NGMS.locate(880, 370)
jail.NGMS.hide()

var clickNGMS = 0;
var clickNGMS1 = 0;
jail.NGMS.onClick = function() {
   if(jail.translator2.isHanded()) {
      if(clickNGMS1 == 0) {
         printMessage('남궁민수: 왜 불렀어(계속 클릭)')
         clickNGMS1 += 1
      } else if(clickNGMS1 == 1) {
         printMessage('남궁민수: 꼬리칸을 탙출하고 싶다고?(계속 클릭)')
         clickNGMS1 += 1
      } else if(clickNGMS1 == 2) {
         printMessage('남궁민수: 그래서 도움이 필요하다고?(계속 클릭)')
         clickNGMS1 += 1
      } else if(clickNGMS1 == 3) {
         printMessage('남궁민수: (대충 험한말) (계속 클릭)')
         clickNGMS1 += 1
      } else if(clickNGMS1 == 4) {
         printMessage('남궁민수: 크로놀을 주겠다고..? 그럼 거절할 수가 없지.(계속 클릭)')
         clickNGMS1 += 1
      } else if(clickNGMS1 == 5) {
         printMessage('남궁민수: 이 열차를 만든것이 30년 전이니깐 그때의 년도로 비밀번호를 설정했을거야.')
         clickNGMS1 += 1
      } else {
         printMessage('남궁민수: password = that_Year - 30;')
      }
   } else {
      if(clickNGMS == 0) {
         printMessage('남궁민수: %dㄴ8*ㄹㅇㄴdfl?dfaKKD124????')
         clickNGMS += 1
      } else if(clickNGMS == 1) {
         printMessage('말을 알아 들을수가 없어... 번역기가 어디에 있지?(계속 클릭)')
         clickNGMS += 1
      } else if(clickNGMS == 2) {
         printMessage('남궁민수와 대화하기 위해서는 번역기가 필요합니다.')
         clickNGMS = 0
      }
   }
}

jail.box1 = new Drawer(jail, 'box1', '상자3-닫힘.png', '상자3-열림.png')
jail.box1.resize(300)
jail.box1.locate(150, 570)

jail.kronole = new Item(jail, 'kronole', '크로놀1.png')
jail.kronole.resize(80)
jail.kronole.locate(150, 590)
jail.kronole.hide()

jail.kronole.onClick = function() {
   printMessage('크로놀을 획득했다.')
   jail.kronole.pick()
}

jail.box1.onOpen = function() {
    jail.box1.setSprite("상자3-닫힘.png")
   jail.kronole.hide()
}
jail.box1.onClose = function() {
    jail.box1.setSprite("상자3-열림.png")
   jail.kronole.show()
}

jail.book = new Object(jail, 'book', '노트.png')
jail.book.resize(100)
jail.book.locate(350, 570)

jail.book.onClick = function() {
   showImageViewer('펼친책.png', '펼친책.txt')
}

//////////터널 깜깜//////////

// soldier

tunnel_dark.soldier = new Soldier(tunnel_dark, "soldier", "soldier1.png", "soldier1_dead.png", 0, tail.drum3)
tunnel_dark.soldier.resize(100)
tunnel_dark.soldier.locate(750, 400)
tunnel_dark.soldier.onClick = function() {
     if (this.item.isHanded()) {
         playSound("퍽!.wav")
         if(this.count < 2) {
             this.count += 1
             printMessage("휘두른 드럼통에 누군가가 맞았다!")
             this.id.moveX(-100)
             this.id.moveY(-100)
             tunnel_dark.locateObject(this.id, soldierX, soldierY)
         } else if (this.count == 2) {
             printMessage("윌포드의 병사가 죽었다.")
             this.id.hide()
             tunnel_dark.nvGoggles.show()
         } else {
             printMessage("윌포드의 병사가 죽어 있다.")
         }
     } else {
         printMessage("누군가 가로막고 있는 것 같다.")
     }
 }



tunnel_dark.nvGoggles = new Object(tunnel_dark, "nvGoggles", "nightVisionGoggles.png")
tunnel_dark.nvGoggles.resize(80)
tunnel_dark.nvGoggles.locate(600, 500)
tunnel_dark.nvGoggles.hide()
tunnel_dark.nvGoggles.onClick = function() {
    Game.move(tunnel_nv)
    printMessage("이제야 앞이 보이네..")
    Game.setTimer()
}

//////////터널 야시경 착용//////////
var kill = 0

tunnel_nv.toDoor = new Go(tunnel_nv, "toDoor", "door_closed_green.png", tunnel_door)
tunnel_nv.toDoor.resize(40)
tunnel_nv.toDoor.locate(650, 285)
tunnel_nv.toDoor.onClick = function() {
    if(kill == 8) {  // 군인 8명 죽였으면
        Game.move(this.connectedTo)
        Game.hideTimer()
    } else {  // 덜 죽였으면
        printMessage("이곳에 있는 병사들을 모두 죽여야 한다.")
    }
}

tunnel_nv.soldier1 = new Soldier(tunnel_nv, "soldier1", "soldier1.png", "soldier1_dead.png", 0, tail.drum3)
tunnel_nv.soldier1.resize(130)
tunnel_nv.soldier1.locate(750, 300)

tunnel_nv.soldier2 = new Soldier(tunnel_nv, "soldier2", "soldier2.png", "soldier2_dead.png", 0, tail.drum3)
tunnel_nv.soldier2.resize(165)
tunnel_nv.soldier2.locate(450, 350)

tunnel_nv.soldier3 = new Soldier(tunnel_nv, "soldier3", "soldier3.png", "soldier3_dead.png", 0, tail.drum3)
tunnel_nv.soldier3.resize(130)
tunnel_nv.soldier3.locate(550, 380)

tunnel_nv.soldier4 = new Soldier(tunnel_nv, "soldier4", "soldier4.png", "soldier4_dead.png", 0, tail.drum3)
tunnel_nv.soldier4.resize(165)
tunnel_nv.soldier4.locate(850, 320)

tunnel_nv.soldier5 = new Soldier(tunnel_nv, "soldier5", "soldier1.png", "soldier1_dead.png", 0, tail.drum3)
tunnel_nv.soldier5.resize(130)
tunnel_nv.soldier5.locate(1000, 400)

tunnel_nv.soldier6 = new Soldier(tunnel_nv, "soldier6", "soldier2.png", "soldier2_dead.png", 0, tail.drum3)
tunnel_nv.soldier6.resize(165)
tunnel_nv.soldier6.locate(700, 450)

tunnel_nv.soldier7 = new Soldier(tunnel_nv, "soldier7", "soldier3.png", "soldier3_dead.png", 0, tail.drum3)
tunnel_nv.soldier7.resize(130)
tunnel_nv.soldier7.locate(300, 430)

tunnel_nv.soldier8 = new Soldier(tunnel_nv, "soldier8", "soldier4.png", "soldier4_dead.png", 0, tail.drum3)
tunnel_nv.soldier8.resize(165)
tunnel_nv.soldier8.locate(950, 460)

tunnel_nv.back = new Go(tunnel_nv, "back", "back.png", jail)
tunnel_nv.back.resize(80)
tunnel_nv.back.locate(100, 650)


//////////터널_다음 방 문 앞//////////
tunnel_door.door = new Door(tunnel_door, "door", "door_closed_green.png", "door_open_green.png", kindergarten)
tunnel_door.door.resize(400)
tunnel_door.door.locate(645, 400)
tunnel_door.door.lock()
tunnel_door.door.onUnlock = function() {
    this.id.setWidth(315)
    this.id.moveY(5)
    this.id.setSprite(this.openedImage)
}
tunnel_door.door.video = 0  // 최초 1회만 비디오 실행
tunnel_door.door.onClick = function() {
   if(!this.id.isLocked() && tunnel_door.door.video == 0){
        Game.move(this.connectedTo)
        showVideoPlayer("kindergarten_intro.mp4")
        tunnel_door.door.video = 1
   } else if (!this.id.isLocked() && tunnel_door.door.video == 1){
        Game.move(this.connectedTo)
    } else {
        printMessage("남궁민수에게 열어달라고 부탁해야겠다.")
    }
}

tunnel_door.minsu = new Keypad(tunnel_door, "minsu", "namgungminsu_green.png", "0011", function(){
    tunnel_door.door.unlock()
    printMessage("철커덕")
})
tunnel_door.minsu.resize(500);
tunnel_door.minsu.locate(1020, 500)
tunnel_door.minsu.onClick = function() {
   if (tunnel_door.door.isLocked()) {
      printMessage("지금까지 만난 사람은 몇 명??");
      showKeypad("number", this.password, this.callback)
   } else {
      printMessage("나가셈")
   }
}

tunnel_door.back = new Go(tunnel_door, "back", "back.png", tunnel_nv)
tunnel_door.back.resize(80)
tunnel_door.back.locate(100, 650)

//////////유치원//////////
kindergarten.door1 = new Door(kindergarten, "door1", "door_left_close.png", "door_left_open.png", tunnel_door)
kindergarten.door1.resize(100)
kindergarten.door1.locate(100, 425)

kindergarten.door2 = new Door(kindergarten, "door2", "door_right_close.png", "door_right_open.png", unclearroom)
kindergarten.door2.resize(100)
kindergarten.door2.locate(1200, 430)
kindergarten.door2.lock()
kindergarten.door2.onUnlock = function() {
    printMessage("먼 길을 왔더니 정신이 어지럽군.")
    kindergarten.door2.open()
    kindergarten.door2.setSprite("door_right_open.png")
}/*
kindergarten.door2.onClick = function() {
    if (this.id.isOpened()) {
        game.move(this.connectedTo)
    } else {
        printMessage("남궁민수에게 열어달라고 부탁해야겠다.")
    }
}*/

kindergarten.board = new MsgObj(kindergarten, "board", "whiteBoard_bong.jpg", "이상한 낙서가...")
kindergarten.board.resize(300)
kindergarten.board.locate(850, 330)

kindergarten.frame = new MsgObj(kindergarten, "frame", "frame.png", "북극곰 사진이다.")
kindergarten.frame.resize(100)
kindergarten.frame.locate(430, 220)

kindergarten.box1 = new Box(kindergarten, "box1", "4-cover-Box(Closed)-sw.png", "4-cover-Box(Opened)-sw.png")
kindergarten.box1.resize(100)
kindergarten.box1.locate(250, 530)
kindergarten.box1.lock()
kindergarten.box1.hide()
kindergarten.box1.onClick = function() {
   if(this.id.isOpened()){
      this.id.close()
      this.id.setSprite(this.closedImage);   
      kindergarten.scroll.hide()
   } else if (this.id.isClosed()){
      this.id.open()
      this.id.setSprite(this.openedImage);
        kindergarten.scroll.show()
   } else if (this.id.isLocked()) {
      printMessage("자물쇠로 잠겨 있다.")
   }
}

kindergarten.keypad1 = new Keypad(kindergarten, "keypad1", "keypad2-se.png", "438000", function(){
    kindergarten.box1.unlock()
    printMessage("철커덕")
})
kindergarten.keypad1.resize(12);
kindergarten.keypad1.locate(260, 555)
kindergarten.keypad1.hide()
kindergarten.keypad1.onClick = function() {
   if (kindergarten.box1.isLocked()) {
      printMessage("열차 한 바퀴는 몇 km?");
      showKeypad("telephone", this.password, this.callback)
   } else {
      printMessage("잠금이 해제되었다.")
   }
}

kindergarten.scroll = new Object(kindergarten, "scroll", "scroll.png")
kindergarten.scroll.resize(40)
kindergarten.scroll.locate(250, 540)
kindergarten.scroll.hide()
kindergarten.scroll.onClick = function() {
    showImageViewer("hint_paper.png", "")
}

kindergarten.bookcase = new Object(kindergarten, "bookcase", "bookcase.png")
kindergarten.bookcase.resize(400)
kindergarten.bookcase.locate(430, 420)
kindergarten.bookcase.lock()
kindergarten.bookcase.move = 0
kindergarten.bookcase.onUnlock = function() {
    if (kindergarten.bookcase.move == 0) {
        this.id.moveX(50)
        kindergarten.dog.id.moveX(50)
        kindergarten.indian.id.moveX(50)
        kindergarten.bow.id.moveX(50)
        kindergarten.okja.id.moveX(50)
        kindergarten.train.id.moveX(50)
        kindergarten.remoteNoBattery.id.moveX(50)
        kindergarten.mars.id.moveX(50)
        kindergarten.reed.id.moveX(50)
        kindergarten.bookcase.move = 1
        kindergarten.box1.id.show()
        kindergarten.keypad1.id.show()
    }
}
kindergarten.bookcase.onClick = function() {  // 열쇠로 해도 안 움직임
    if (this.id.isLocked()) {
        printMessage("장식장을 자세히 살펴보니 뒤에 작은 공간과 열쇠구멍이 있다.")
    }
    if (kindergarten.key.isHanded() && kindergarten.bookcase.move == 0) {
        this.id.unlock()
        printMessage("열쇠로 여니 자동으로 장식장이 움직인다.")
    } else if (kindergarten.bookcase.move == 1) {
        printMessage("더 이상 움직이지 않는다.")
    }
}

kindergarten.dog = new MsgObj(kindergarten, "dog", "dog.png", "강아지를 보면 파트라슈가 떠올라. 그 동화 제목이 뭐더라?")
kindergarten.dog.resize(50)
kindergarten.dog.locate(280, 370)

kindergarten.indian = new MsgObj(kindergarten, "indian", "indian.png", "인디언 인형이다.")
kindergarten.indian.resize(50)
kindergarten.indian.locate(380, 360)

kindergarten.bow = new MsgObj(kindergarten, "bow", "bow.png", "장난감 양궁활이다")
kindergarten.bow.resize(40)
kindergarten.bow.locate(480, 363)

kindergarten.okja = new MsgObj(kindergarten, "okja", "okja.png", "돼지 같기도 하고 하마 같기도 한데...")
kindergarten.okja.resize(70)
kindergarten.okja.locate(575, 373)

kindergarten.train = new MsgObj(kindergarten, "train", "train.png", "우리 열차랑 비슷하게 생겼네.")
kindergarten.train.resize(70)
kindergarten.train.locate(285, 475)

kindergarten.mars = new MsgObj(kindergarten, "mars", "mars.png", "화성 모형이다.")
kindergarten.mars.resize(50)
kindergarten.mars.locate(380, 460)

kindergarten.reed = new MsgObj(kindergarten, "reed", "reed.png", "갈대가 어떻게 여기서 자라지?")
kindergarten.reed.resize(50)
kindergarten.reed.locate(580, 460)

kindergarten.box2 = new Box(kindergarten, "box2", "Box(Closed)-se.png", "Box(Opened)-se.png")
kindergarten.box2.resize(110)
kindergarten.box2.locate(1200, 670)
kindergarten.box2.lock()
kindergarten.box2.onClick = function() {
   if(this.id.isOpened()){
      this.id.close()
      this.id.setSprite(this.closedImage);   
      kindergarten.battery.hide()
   } else if (this.id.isClosed()){
      this.id.open()
      this.id.setSprite(this.openedImage);
        kindergarten.battery.show()
   } else if (this.id.isLocked()) {
      printMessage("자물쇠로 잠겨 있다.")
   }
}

kindergarten.keypad2 = new Keypad(kindergarten, "keypad2", "cryptex-sw.png", "WHITE", function(){
    kindergarten.box2.unlock()
    printMessage("철커덕")
})
kindergarten.keypad2.resize(36);
kindergarten.keypad2.locate(1165, 695)
kindergarten.keypad2.onClick = function() {
   if (kindergarten.box2.isLocked()) {
      printMessage("곰의 색깔은?");
      showKeypad("alphabet", this.password, this.callback)
   } else {
      printMessage("잠금이 해제되었다.")
   }
}

kindergarten.remoteNoBattery = new Item(kindergarten, "remoteNoBattery", "리모컨.png")
kindergarten.remoteNoBattery.resize(70)
kindergarten.remoteNoBattery.locate(480, 485)

kindergarten.battery = new Item(kindergarten, "battery", "건전지.png")
kindergarten.battery.resize(30)
kindergarten.battery.locate(1190, 660)
kindergarten.battery.hide()

kindergarten.remote = new Item(kindergarten, "remote", "리모컨.png")
kindergarten.remote.hide()
Game.combination(kindergarten.remoteNoBattery, kindergarten.battery, kindergarten.remote)

kindergarten.tv = new Object(kindergarten, "tv", "tv.png")
kindergarten.tv.resize(200)
kindergarten.tv.locate(1050, 170)
kindergarten.tv.onClick = function() {
    if(kindergarten.remote.isHanded()) {
        showVideoPlayer("kindergarten.mp4")
    } else {
        printMessage("리모컨으로 켜볼까?")
    }
}

kindergarten.cart = new Object(kindergarten, "cart", "cart.png")
kindergarten.cart.resize(250)
kindergarten.cart.locate(240, 650)

kindergarten.egghint = new Object(kindergarten, "egghint", "hint_egg.png")
kindergarten.egghint.resize(50)
kindergarten.egghint.locate(210, 653)
kindergarten.egghint.onClick = function() {
    showImageViewer("hint_egg.png", "")
    printMessage("글자가 가려져서 잘 안 보인다.")
}

kindergarten.memohint = new Object(kindergarten, "memohint", "memo.png")
kindergarten.memohint.resize(30)
kindergarten.memohint.locate(270, 630)
kindergarten.memohint.onClick = function() {
    showImageViewer("hint_memo.png", "")
    printMessage("이게 뭐지??")
}

kindergarten.eggs = new Object(kindergarten, "eggs", "eggs.png")
kindergarten.eggs.resize(200)
kindergarten.eggs.locate(237, 633)
kindergarten.eggs.onClick = function() {
    kindergarten.eggs.hide()
    printMessage("달걀 더미를 치웠다.")
}

kindergarten.minsu = new Keypad(kindergarten, "minsu", "namgungminsu.PNG", "1638542", function(){
    kindergarten.door2.unlock()
    printMessage("철커덕")
})
kindergarten.minsu.resize(150);
kindergarten.minsu.locate(1020, 380)
kindergarten.minsu.onClick = function() {
   if (kindergarten.door2.isLocked()) {
      printMessage("그래서 비밀번호는?");
      showKeypad("telephone", this.password, this.callback)
   } else {
      printMessage("나가셈")
   }
}

kindergarten.lecturedesk = new MsgObj(kindergarten, "lecturedesk", "lectureDesk.png", "윌포드 산업 로고가 새겨진 교탁이다.")
kindergarten.lecturedesk.resize(200)
kindergarten.lecturedesk.locate(1000, 550)

kindergarten.note = new Object(kindergarten, "note", "note.png")
kindergarten.note.resize(60)
kindergarten.note.locate(1000, 450)
kindergarten.note.onClick = function() {
    showImageViewer("bearquiz.png", "")
    printMessage("재미없는데..")
}

kindergarten.key = new Item(kindergarten, "key", "key.png")
kindergarten.key.resize(50)
kindergarten.key.locate(550, 650)

kindergarten.desk1 = new Object(kindergarten, "desk1", "desk.png")
kindergarten.desk1.resize(180)
kindergarten.desk1.locate(520, 600)
kindergarten.desk1.onClick = function() {
    printMessage("윌포드 산업 로고가 새겨진 책상이다.")
}
kindergarten.desk1.move = 0
kindergarten.desk1.onDrag = function(direction) {
    if (direction == "Left" && kindergarten.desk1.move == 0) {
        printMessage("책상을 밀었다!")
        this.id.moveX(-50)
        kindergarten.desk1.move = 1
    } else {
        printMessage("윌포드 산업 로고가 새겨진 책상이다.")
    }
}

kindergarten.desk2 = new MsgObj(kindergarten, "desk2", "desk.png","윌포드 산업 로고가 새겨진 책상이다.")
kindergarten.desk2.resize(180)
kindergarten.desk2.locate(750, 600)

kindergarten.child = new Object(kindergarten, "child", "child1.png")
kindergarten.child.resize(100)
kindergarten.child.locate(750, 432)
kindergarten.child.onClick = function() {
    if (this.id.isClosed()){
        this.id.open()
        this.id.setSprite("child2.png")
        printMessage("책상 밑에 뭐가 떨어져 있는 것 같아요. 주워 주세요!")
    } else {
        this.id.close()
        this.id.setSprite("child1.png")
        playSound("kindergarten_song.wav")
        printMessage("♪ 엔진이 멈추면 무슨 일이 생길까? 우리 모두 얼어 죽는다네 ♬..")
    }
}

//////////흔들리는 배경//////////
//박스
unclearroom.box = new Box(unclearroom, "box", "상자3-닫힘.png",'상자3-열림.png')
unclearroom.box.resize(130) 
unclearroom.box.locate(880, 590)
unclearroom.box.onClick = function() {

   if(this.id.isOpened()){
      this.id.close()
      unclearroom.pill.hide()
   } 
   else if (this.id.isClosed()){
      this.id.open()
        unclearroom.pill.show()
   printMessage("상자 속에 무언가가 있다!")
}
}


//약
unclearroom.pill = new Item(unclearroom, "pill", "약.png")
unclearroom.pill.resize(90) 
unclearroom.pill.locate(880, 590)
unclearroom.pill.hide()
unclearroom.pill.onClick = function() {
   Game.move(frontroom)
   unclearroom.pill.hide()
   unclearroom.box.hide()
   printMessage("해독제를 먹으니 정신이 드네..")
}


//아이디카드
frontroom.key1 = new Object(frontroom, 'key1', '비서_아이디카드.png')
frontroom.key1.resize(75)
frontroom.key1.locate(700, 550)
frontroom.key1.hide()
frontroom.key1.onClick = function(){
   frontroom.key1.pick()
   printMessage("비서전용 ID카드를 얻었다.");
}


//검은상자-다시 안닫히는 상자
frontroom.blackbox = new Object(frontroom, 'blackbox', '상자2-1-닫힘.png')
frontroom.blackbox.resize(105)
frontroom.blackbox.locate(430, 540)
frontroom.blackbox.onClick = function() {
 if (frontroom.bat.isHanded()){
   playSound("퍽!.wav")

      this.id.setSprite('상자2-1-열림.png')
        frontroom.san.show()
   printMessage("상자 뚜껑을 날렸다!")   
}
else {printMessage("묵직한게 들어 있지만 뚜껑이 열리지 않는다")}
}



//검은상자2
frontroom.blackbox2 = new Box(frontroom, 'blackbox2', '상자2-1-닫힘.png','상자2-1-열림.png')
frontroom.blackbox2.resize(105)
frontroom.blackbox2.locate(375, 600)
frontroom.blackbox2.onClick = function() {

   if(this.id.isOpened()){
      this.id.close()
   } 
   else if (this.id.isClosed()){
      this.id.open()
   printMessage("빈 박스다.")
}
}

//검은상자3
frontroom.blackbox3 = new Box(frontroom, 'blackbox3', '상자2-1-닫힘.png','상자2-1-열림.png')
frontroom.blackbox3.resize(95)
frontroom.blackbox3.locate(470, 470)
frontroom.blackbox3.onClick = function() {

   if(this.id.isOpened()){
      this.id.close()
   } 
   else if (this.id.isClosed()){
      this.id.open()
   printMessage("아무것도 없다")
}
}

//산화제+압력용기

frontroom.com_san_press = new Item(frontroom, 'com_san_press', '산화제와용기.png')
frontroom.com_san_press.hide()


//산화제
frontroom.san = new Object(frontroom, 'san', '산화제.png')
frontroom.san.resize(85)
frontroom.san.locate(432, 540)
frontroom.san.hide()
frontroom.san.onClick = function(){
   frontroom.san.pick()
   printMessage("산화제를 주웠다.")
}

//압력용기
frontroom.press = new Object(frontroom, 'press', '압력용기.png')
frontroom.press.resize(85)
 frontroom.press.locate(805, 490)
frontroom.press.onClick = function() {
      frontroom.press.pick()
      printMessage("레드불의 힘으로 큰 용기를 담았다!")
   }


Game.combination(frontroom.san, frontroom.press, frontroom.com_san_press)


//총
frontroom.gun = new Object(frontroom, 'gun', '권총.png')
frontroom.gun.resize(55)
frontroom.gun.locate(769, 550)
frontroom.gun.hide()
 frontroom.gun.onClick = function(){
    frontroom.gun.pick()
    printMessage("총알이 없는 총을 주웠다.")
}


//선반
frontroom.shelter = new Object(frontroom, 'shelter', '선반열차.png')
frontroom.shelter.resize(205)
frontroom.shelter.locate(175, 500)


//방망이
frontroom.bat = new Object(frontroom, 'bat', '방망이.png')
frontroom.bat.resize(155)
frontroom.bat.locate(175, 500)
frontroom.bat.onClick = function(){
   frontroom.bat.pick()
   printMessage("방망이를 주웠다. \n 여기저기 요긴하게 쓸 것 같다.")

}

//방패
frontroom.armour = new Object(frontroom, 'armour', '방패.png')
frontroom.armour.resize(165)
frontroom.armour.locate(175, 400)
frontroom.armour.onClick = function(){
   frontroom.armour.pick()
   printMessage("방패를 주웠다. \n 총을 막을 수 있을 만큼 강해보인다.")

}


//전화기
frontroom.phone = new Object(frontroom, "phone", "전화기-오른쪽-1.png")
frontroom.phone.resize(30)
frontroom.phone.locate(800, 298)
var Phoneclick = 0
frontroom.phone.onClick = function() {
   if(Phoneclick == 0){
   playSound("전화신호음1.wav")
   printMessage("신호는 가는데 응답이 없네. 한번 더 눌러보자!")
   Phoneclick +=1
   }

   else if(Phoneclick == 1){
      frontroom.phone.setSprite('전화기-오른쪽-2.png')
      playSound("비서_안녕.wav")
      printMessage("7초 안에 방패를 줍고\n 비서를 클릭해서 총알을 막아라!")
      frontroom.woman_s.show()
      Game.setTimer()
      Phoneclick +=1


}
}


//비서
frontroom.woman_s = new Object(frontroom, "woman_s", "그냥비서.png") 
frontroom.woman_s.resize(130)
frontroom.woman_s.locate(700, 450) 
frontroom.woman_s.hide()
var Womanclick=0
frontroom.woman_s.onClick = function(){
   if(Womanclick==0 && frontroom.armour.isHanded()){
      Game.hideTimer()
      playSound("총두발.wav")
      printMessage("방패로 막다니..!")
      Womanclick+=1
   }

   else if(Womanclick==1 && frontroom.bat.isHanded()){
        Game.hideTimer()
      playSound("퍽!.wav")
      printMessage("방망이로 기절시켰다!")
      frontroom.woman_s.setSprite('죽은비서1.png')
      frontroom.key1.show()
      frontroom.gun.show()
      Womanclick+=1

   }
   else if(Womanclick==0) {
      printMessage("방패 없이 총을 맞았다.. 시야가 점점 흐려진다")
      playSound("총두발.wav")
      Game.move(unclearroom)
}
   else if(Womanclick>=1 && frontroom.armour.isHanded()){
      printMessage("내가 있는 한 윌포드님 방에 들어갈 수 없다!")
   }
}


//상자
frontroom.box = new Object(frontroom, "box", "상자3-열림.png")
frontroom.box.resize(130) 
frontroom.box.locate(880, 590)
frontroom.box.onClick = function() {
   printMessage("약을 꺼냈던 상자다.")
}


//고아성마지막
frontroom.goa = new Object(frontroom, "goa", "고아성마지막.png")
frontroom.goa.resize(100) 
frontroom.goa.locate(430, 540)
frontroom.goa.hide()
frontroom.goa.onClick = function() {
   printMessage("여기 문에 폭탄을 붙이고 성냥을 켜요!")
}

//폭탄자리
frontroom.bombplace = new Object(frontroom, "bombplace", "가상문22.png")
frontroom.bombplace.resize(80) 
frontroom.bombplace.locate(310, 390)
frontroom.bombplace.onClick = function() {
   if(enginroom.krobomb.isHanded()){
   printMessage("폭탄을 붙였다!")
   frontroom.doorbomb.show()
}
else if(enginroom.krobomb.isPicked()){
   printMessage("여기 폭탄을 붙이면 될 것 같다.")
}
   else{printMessage("심상치 않은 문이다.")}
}

//폭탄붙이기용
frontroom.doorbomb = new Object(frontroom, "doorbomb", "크로놀폭탄.png")
frontroom.doorbomb.resize(100) 
frontroom.doorbomb.locate(330, 390)
frontroom.doorbomb.hide()
frontroom.doorbomb.onClick = function() {
   if(lastroom.fire.isHanded()){
      playSound("폭발음.wav")
      frontroom.bombbomb.show()
      frontroom.doorbomb.hide()
      frontroom.goa.hide()

      printMessage("뻥!")
}
}

//폭발
frontroom.bombbomb = new Object(frontroom, "bombbomb", "폭발빵.png")
frontroom.bombbomb.resize(500) 
frontroom.bombbomb.locate(300, 390)
frontroom.bombbomb.hide()
frontroom.bombbomb.onClick = function() {
   playSound('불방.wav')
   Game.move(endroom)}


//마지막게임끝
endroom.door = new Object(endroom, "door", "가상문22.png")
endroom.door.resize(80) 
endroom.door.locate(310, 390)
endroom.door.onClick = function() {
   showImageViewer('눈.jpg',"")
   playSound("마지막음악.wav")
   Game.end()}





//윌포드문양키패드

frontroom.markpad = new Keypad(frontroom, "markpad", '윌포드문양.png', "8622", function(){
    frontroom.door1.unlock()
   printMessage("비밀번호 일치, 카드를 대고 문을 여세요.")
})
frontroom.markpad.resize(50);
frontroom.markpad.locate(700, 290)
frontroom.markpad.onClick = function() {
   if (frontroom.door1.isLocked()) {
      printMessage("암호를 입력하시오.");
      showKeypad("telephone", this.password, this.callback)
   } else {
      printMessage("문을 열고 들어오세요.")
   }
}


//문
frontroom.door1 = new Door(frontroom, 'door1', '윌포드전방-문닫힘.png', '윌포드전방-문열림.png', lastroom)
frontroom.door1.resize(173)
frontroom.door1.locate(580, 300)
frontroom.door1.lock()
frontroom.door1.onClick = function(){

   if (frontroom.key1.isHanded() && !this.id.isLocked() && this.id.isClosed()){
      this.id.open()
      printMessage("승인되었습니다.")
   }


   else if (this.id.isOpened()){
         playSound("마지막방노래.wav")
         Game.move(this.connectedTo)
      }

   else if(this.id.isLocked())
      {printMessage("윌포드의 방인듯 하다.")
   }

   else {printMessage("승인된 카드를 대고 문을 열어주세요.")
      }
   }

//////////마지막 방//////////
//카페트
lastroom.carpet = new Object(lastroom,"carpet", "carpet.png")
lastroom.carpet.resize(100)
lastroom.carpet.locate(460, 520)


//다음버튼
lastroom.button = new Object(lastroom,"button", "다음.png")
lastroom.button.resize(190)
lastroom.button.locate(1180, 500)

//스토리
var buttonClick = 0
lastroom.button.onClick = function() {
    if(buttonClick == 0){
      printMessage("윌포드 : \"오 카터스! 반갑네.\"")
      playSound("카디스부르기.wav")
        buttonClick += 1
    } else if(buttonClick == 1){
      playSound("엔진내놔.wav")

        printMessage("카터스 : \"우린 엔진을 차지하러 왔다.\"")
        buttonClick += 1
    } else if(buttonClick == 2){
      playSound("자리가있다네.wav")

        printMessage("윌포드 : \"세상엔 질서라는 것이 있네. 각자의 위치가 있는법이지\"")
        buttonClick += 1
    } else if(buttonClick == 3){
      playSound("높은놈들이하는말.wav")

        printMessage("카터스 : \"가장 위에 있는 놈들이 늘 하는 말이지.\"")
      buttonClick += 1
   }

   else if(buttonClick == 4){
      playSound("이자리너할래.wav")

        printMessage("윌포드 : \"카디스, 사실 너에게 이 자리를 주려고했네.\"")
        buttonClick += 1
   }
   
   else if(buttonClick == 5){
      playSound("카터스_뭐라고.wav")

        printMessage("카터스 : \"뭐라고?\"")
        buttonClick += 1
   }

   else if(buttonClick == 6){
      playSound("윌포드_이리오게나.wav")

      printMessage("윌포드 : \"가서 저 엔진을 한 번 느껴보게.\"")
      buttonClick += 1
   }

   else if(buttonClick == 7){
      lastroom.ford.id.moveX(-500) //윌포드 옮기기
      lastroom.ford.id.moveY(-2)
      lastroom.ford.resize(140)
      printMessage("카터스 : (머뭇 머뭇)")
      buttonClick += 1
   }

   else if(buttonClick == 8){
      
      playSound("윌포드_컴언.wav")

      printMessage("윌포드 : \"어서\"")
      buttonClick += 1
   }
   else if(buttonClick == 9){
      lastroom.catis.show()

      showVideoPlayer("엔진을느끼다.mp4")
      buttonClick += 1
}

   else if(buttonClick == 10){
      playSound("니운명이야.wav")

        printMessage("윌포드 : \"너가 다음번 엔진의 주인일세.\"")
      buttonClick += 1
}
   else if(buttonClick == 11){
      lastroom.button.hide()
      playSound("총쏘는고아성.wav")
      printMessage("고아성 : \"카티스 우린 여길 나가야해요!\"")
      lastroom.ford.setSprite('윌포드_죽음.png')
      lastroom.catis.setSprite('카티스앞모습.png')
      lastroom.catis.id.moveY(50)
      lastroom.littlegirl.show()
      lastroom.bullet.show()

}
}


//돌아가기
lastroom.arrow = new Object(lastroom,"arrow", "돌아가기.png")
lastroom.arrow.resize(100)
lastroom.arrow.locate(320, 600)
lastroom.arrow.hide()
lastroom.arrow.onClick = function()
{Game.move(frontroom)
printMessage("이 문에 폭탄을 붙이고 터뜨리면 돼요!")}


//총알
lastroom.bullet = new Object(lastroom,"bullet", "총알.png")
lastroom.bullet.resize(35)
lastroom.bullet.locate(540, 570)
lastroom.bullet.hide()
lastroom.bullet.onClick = function() {
    lastroom.bullet.pick()
printMessage("총알을 주웠다.")
}


//책상
lastroom.table = new Object(lastroom,"table", "테이블2-2.png")
lastroom.table.resize(165)
lastroom.table.locate(769, 560)

//책
lastroom.books = new Object(lastroom,"books", "책2-2.png")
lastroom.books.resize(75)
lastroom.books.locate(769, 500)
var Bookclick=0
lastroom.books.onClick = function()
{
   if(Bookclick==0){printMessage("책 속에 무언가가 있는 것 같다. \n 좀 더 자세히 뒤져보자!")
Bookclick+=1}

   else if(Bookclick>=1){showImageViewer("윌포드일기.png", "")
   printMessage("암호가 한국어로 되어 있다. \n한국인에게 물어봐야 할 것 같은데.")
}
}


//고아성
lastroom.littlegirl = new Object(lastroom,"littlegirl", "고아성.png")
lastroom.littlegirl.resize(150)
lastroom.littlegirl.locate(100, 630)
lastroom.littlegirl.hide()
lastroom.littlegirl.onClick = function()
{
   if(Bookclick>=1){printMessage("한글 순서에 따라 번호가 있어요!")
   showImageViewer("한글순서.png", "")}
else if(Bookclick==0){printMessage("성냥을 찾아서 나가야해요!")}
}




//서랍
lastroom.drawer = new Box(lastroom,"drawer", "서랍-닫힘.png","서랍-열림.png")
lastroom.drawer.resize(135)
lastroom.drawer.locate(239, 590)
lastroom.drawer.lock()
lastroom.drawer.onClick = function()
{
   if(kindergarten.key.isHanded()&&this.id.isLocked())
   {   this.id.unlock()
      printMessage("서랍장이 열렸다!")
}

else if(this.id.isOpened()){
   this.id.close()
   lastroom.fire.hide()

} 
else if (this.id.isClosed()){
   this.id.open()
   lastroom.fire.show()

}

else{printMessage("서랍장이 단단히 잠겨있다.")}
}


//성냥
lastroom.fire = new Object(lastroom,"fire", "성냥.png")
lastroom.fire.resize(35)
lastroom.fire.locate(267, 580)
lastroom.fire.hide()
lastroom.fire.onClick = function() {
   lastroom.fire.pick()
printMessage("성냥을 주웠다.")
}

//엔진
lastroom.engine = new Door(lastroom,"engine", "엔진.png", "엔진끔.png",enginroom)
lastroom.engine.resize(250)
lastroom.engine.locate(640, 390)
lastroom.engine.lock()
lastroom.engine.onClick = function()
{
   if(this.id.isLocked()){
   printMessage("멈추지 않는 엔진을 꺼야한다.")
}
else if(this.id.isOpened()){
   Game.move(this.connectedTo)
   printMessage("윌포드의 물건들이 들어있다.")
}
}
lastroom.engine.onUnlock = function() {
    lastroom.engine.open()
   printMessage("엔진이 멈췄다.")

}



// 엔진잠금장치
lastroom.enginekeypad = new Keypad(lastroom, "enginekeypad", '윌포드키패드.png', "8191312", function(){
   lastroom.engine.unlock()
   playSound("엔진멈춤.wav")
   printMessage("엔진 수동가동으로 변경")
})
lastroom.enginekeypad.resize(50);
lastroom.enginekeypad.locate(790, 400)
lastroom.enginekeypad.onClick = function() {
   if (lastroom.engine.isLocked()) {
      printMessage("엔진을 멈추기 위한 암호는?");
      showKeypad("telephone", this.password, this.callback)
   } else {
      printMessage("엔진이 멈췄습니다.")
   }
}




//윌포드
lastroom.ford = new Object(lastroom, "ford", "윌포드휠체어.png") // 
lastroom.ford.resize(180) // 크기 조절
lastroom.ford.locate(950, 490) // 
lastroom.ford.onClick = function(){
 if (buttonClick==11){
   printMessage("윌포드의 주머니에서 무언가를 찾았다!")
 }
 else{   printMessage("환영하네 카티스!")
}
}


//카티스
lastroom.catis = new Object(lastroom, "catis", "카티스뒷모습.png") // 
lastroom.catis.resize(80) // 크기 조절
lastroom.catis.locate(650, 470) // 
lastroom.catis.hide()

//////////엔진룸 안//////////
//나가는 화살표
enginroom.arrow = new Object(enginroom,"arrow", "돌아가기.png")
enginroom.arrow.resize(120)
enginroom.arrow.locate(950, 650)
enginroom.arrow.onClick = function()
{Game.move(lastroom)}

//금고
enginroom.goldbox = new Box(enginroom,"goldbox", "safe2-se-close.png","safe2-se-open.png")
enginroom.goldbox.resize(120)
enginroom.goldbox.locate(250, 600)
enginroom.goldbox.lock()
enginroom.goldbox.onClick = function()
{if(kindergarten.key.isHanded()&&this.id.isLocked())
   {printMessage("키가 맞지 않다.")
}
else if(enginroom.shotgun.isHanded()&&this.id.isLocked()){
   playSound("shotgun.wav")
   printMessage("금고가 열렸다!")
   this.id.unlock()

}

else if(this.id.isOpened()){
   this.id.close()
   enginroom.script.hide()

} 
else if (this.id.isClosed()){
   this.id.open()
   enginroom.script.show()

}

else{printMessage("너무 단단해서 열쇠로 열 수 없을 것 같다.")}
}


//설명서
enginroom.script = new Object(enginroom,"script", "설명서.png")
enginroom.script.resize(60)
enginroom.script.locate(250, 592)
enginroom.script.hide()
enginroom.script.onClick = function()
{showImageViewer("설명서.png", "")
printMessage("무언가를 제조할 수 있는 설명서다.")
lastroom.arrow.show()
frontroom.goa.show()
}


//크로놀폭탄
enginroom.krobomb = new Object(enginroom,"krobomb", "크로놀폭탄.png")
enginroom.krobomb.hide()

//샷건
enginroom.shotgun = new Object(enginroom,"shotgun", "장전된총.png")
enginroom.shotgun.hide()

//총결합
Game.combination(frontroom.gun, lastroom.bullet, enginroom.shotgun)


//크로놀과 결합용기
Game.combination(frontroom.com_san_press, jail.kronole, enginroom.krobomb)



//////////gameStart//////////
Game.start(tail, ' ')
showVideoPlayer('intro.mp4')
printMessage('여긴... 어디지?')

Game.setGameoverMessage()