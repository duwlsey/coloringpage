(()=>{
const items=[
{name:'고양이',image:'images/animals/cat.png'},
{name:'토끼',image:'images/animals/rabbit.png'},
{name:'강아지',image:'images/animals/puppy.png'},
{name:'코끼리',image:'images/animals/elephant.png'},
{name:'곰',image:'images/animals/bear.png'}
];
const food=[
{name:'도넛',image:'images/food/donut.png'},
{name:'컵케이크',image:'images/food/cupcake.png'},
{name:'햄버거',image:'images/food/hamburger.png'},
{name:'피자 한 조각',image:'images/food/pizza-slice.png'},
{name:'아이스크림',image:'images/food/ice-cream.png'}
];
const produce=[
{name:'사과',image:'images/produce/apple.png'},
{name:'배',image:'images/produce/pear.png'},
{name:'딸기',image:'images/produce/strawberry.png'},
{name:'당근',image:'images/produce/carrot.png'},
{name:'브로콜리',image:'images/produce/broccoli.png'}
];
const vehicles=[
{name:'자동차',image:'images/vehicles/car.png'},
{name:'버스',image:'images/vehicles/bus.png'},
{name:'기차',image:'images/vehicles/train.png'},
{name:'비행기',image:'images/vehicles/airplane.png'},
{name:'배',image:'images/vehicles/boat.png'}
];
const ocean=[
{name:'고래',image:'images/ocean/whale.png'},
{name:'돌고래',image:'images/ocean/dolphin.png'},
{name:'문어',image:'images/ocean/octopus.png'},
{name:'바다거북',image:'images/ocean/sea-turtle.png'},
{name:'불가사리',image:'images/ocean/starfish.png'}
];
const dinosaurs=[
{name:'티라노사우루스',image:'images/dinosaurs/tyrannosaurus.png'},
{name:'트리케라톱스',image:'images/dinosaurs/triceratops.png'},
{name:'브라키오사우루스',image:'images/dinosaurs/brachiosaurus.png'},
{name:'스테고사우루스',image:'images/dinosaurs/stegosaurus.png'},
{name:'안킬로사우루스',image:'images/dinosaurs/ankylosaurus.png'}
];
const nature=[
{name:'해바라기',image:'images/nature/sunflower.png'},
{name:'튤립',image:'images/nature/tulip.png'},
{name:'참나무',image:'images/nature/oak-tree.png'},
{name:'소나무',image:'images/nature/pine-tree.png'},
{name:'버섯',image:'images/nature/mushroom.png'}
];
const home=[
{name:'의자',image:'images/home/chair.png'},
{name:'소파',image:'images/home/sofa.png'},
{name:'침대',image:'images/home/bed.png'},
{name:'옷장',image:'images/home/wardrobe.png'},
{name:'탁상등',image:'images/home/table-lamp.png'}
];
const play=[
{name:'축구공',image:'images/play/soccer-ball.png'},
{name:'농구공',image:'images/play/basketball.png'},
{name:'야구 글러브',image:'images/play/baseball-glove.png'},
{name:'테니스 라켓',image:'images/play/tennis-racket.png'},
{name:'스케이트보드',image:'images/play/skateboard.png'}
];
const space=[
{name:'로켓',image:'images/space/rocket.png'},
{name:'우주비행사',image:'images/space/astronaut.png'},
{name:'인공위성',image:'images/space/satellite.png'},
{name:'달 탐사차',image:'images/space/lunar-rover.png'},
{name:'토성',image:'images/space/saturn.png'}
];
const imagination=[
{id:'imagination-01',name:'상상 01',svg:'<path fill="none" d="M200 125 C170 76 105 90 108 145 C109 190 165 239 200 275"/>'},
{id:'imagination-02',name:'상상 02',svg:'<path fill="none" d="M125 225 A85 85 0 1 1 270 150"/>'},
{id:'imagination-03',name:'상상 03',svg:'<g fill="black" stroke="none"><circle cx="95" cy="115" r="5"/><circle cx="295" cy="95" r="5"/><circle cx="225" cy="300" r="5"/></g>'},
{id:'imagination-04',name:'상상 04',svg:'<path fill="none" d="M95 205 C125 145 155 265 185 205 S245 145 275 205"/>'},
{id:'imagination-05',name:'상상 05',svg:'<path fill="none" d="M65 130 Q105 70 145 130 M255 285 Q295 225 335 285"/>'},
{id:'imagination-06',name:'상상 06',svg:'<path fill="none" d="M120 245 L165 170 L200 220 L245 135"/>'},
{id:'imagination-07',name:'상상 07',svg:'<path fill="none" d="M145 180 L145 245 Q145 260 160 260 L235 260"/>'},
{id:'imagination-08',name:'상상 08',svg:'<path fill="none" d="M200 190 C180 165 155 195 176 213 C210 243 250 197 224 165 C197 132 150 147 132 175"/>'},
{id:'imagination-09',name:'상상 09',svg:'<path fill="none" d="M105 100 L105 195 M285 200 L285 295"/>'},
{id:'imagination-10',name:'상상 10',svg:'<path fill="none" d="M70 235 L125 135 M260 120 L320 220 M250 310 L140 310"/>'}
];
globalThis.COLORING_CATEGORIES=[{name:'상상',items:imagination},{name:'동물',items},{name:'음식',items:food},{name:'과일·채소',items:produce},{name:'탈것',items:vehicles},{name:'바다',items:ocean},{name:'공룡',items:dinosaurs},{name:'자연',items:nature},{name:'우리 집',items:home},{name:'놀이·운동',items:play},{name:'우주',items:space}];
})();
