(()=>{
const items=[
{name:'고양이',image:'images/animals/cat.png',thumbnail:'thumbnails/animals/cat.webp'},
{name:'토끼',image:'images/animals/rabbit.png',thumbnail:'thumbnails/animals/rabbit.webp'},
{name:'강아지',image:'images/animals/puppy.png',thumbnail:'thumbnails/animals/puppy.webp'},
{name:'코끼리',image:'images/animals/elephant.png',thumbnail:'thumbnails/animals/elephant.webp'},
{name:'곰',image:'images/animals/bear.png',thumbnail:'thumbnails/animals/bear.webp'},
{id:'animals-weekly-20261020-penguin',name:'펭귄',image:'images/animals/penguin-20261020.png',thumbnail:'thumbnails/animals/penguin-20261020.webp'}
];
const food=[
{name:'도넛',image:'images/food/donut.png',thumbnail:'thumbnails/food/donut.webp'},
{name:'컵케이크',image:'images/food/cupcake.png',thumbnail:'thumbnails/food/cupcake.webp'},
{name:'햄버거',image:'images/food/hamburger.png',thumbnail:'thumbnails/food/hamburger.webp'},
{name:'피자 한 조각',image:'images/food/pizza-slice.png',thumbnail:'thumbnails/food/pizza-slice.webp'},
{name:'아이스크림',image:'images/food/ice-cream.png',thumbnail:'thumbnails/food/ice-cream.webp'},
{id:'food-weekly-20261021-bread',name:'빵',image:'images/food/bread-20261021.png',thumbnail:'thumbnails/food/bread-20261021.webp'}
];
const produce=[
{name:'사과',image:'images/produce/apple.png',thumbnail:'thumbnails/produce/apple.webp'},
{name:'배',image:'images/produce/pear.png',thumbnail:'thumbnails/produce/pear.webp'},
{name:'딸기',image:'images/produce/strawberry.png',thumbnail:'thumbnails/produce/strawberry.webp'},
{name:'당근',image:'images/produce/carrot.png',thumbnail:'thumbnails/produce/carrot.webp'},
{name:'브로콜리',image:'images/produce/broccoli.png',thumbnail:'thumbnails/produce/broccoli.webp'},
{id:'produce-weekly-20261022-pumpkin',name:'호박',image:'images/produce/pumpkin-20261022.png',thumbnail:'thumbnails/produce/pumpkin-20261022.webp'}
];
const vehicles=[
{name:'자동차',image:'images/vehicles/car.png',thumbnail:'thumbnails/vehicles/car.webp'},
{name:'버스',image:'images/vehicles/bus.png',thumbnail:'thumbnails/vehicles/bus.webp'},
{name:'기차',image:'images/vehicles/train.png',thumbnail:'thumbnails/vehicles/train.webp'},
{name:'비행기',image:'images/vehicles/airplane.png',thumbnail:'thumbnails/vehicles/airplane.webp'},
{name:'배',image:'images/vehicles/boat.png',thumbnail:'thumbnails/vehicles/boat.webp'},
{id:'vehicles-weekly-20261022-pickup-truck',name:'트럭',image:'images/vehicles/pickup-truck-20261022.png',thumbnail:'thumbnails/vehicles/pickup-truck-20261022.webp'}
];
const ocean=[
{name:'고래',image:'images/ocean/whale.png',thumbnail:'thumbnails/ocean/whale.webp'},
{name:'돌고래',image:'images/ocean/dolphin.png',thumbnail:'thumbnails/ocean/dolphin.webp'},
{name:'문어',image:'images/ocean/octopus.png',thumbnail:'thumbnails/ocean/octopus.webp'},
{name:'바다거북',image:'images/ocean/sea-turtle.png',thumbnail:'thumbnails/ocean/sea-turtle.webp'},
{name:'불가사리',image:'images/ocean/starfish.png',thumbnail:'thumbnails/ocean/starfish.webp'},
{id:'ocean-weekly-20261023-seahorse',name:'해마',image:'images/ocean/seahorse-20261023.png',thumbnail:'thumbnails/ocean/seahorse-20261023.webp'}
];
const dinosaurs=[
{name:'티라노사우루스',image:'images/dinosaurs/tyrannosaurus.png',thumbnail:'thumbnails/dinosaurs/tyrannosaurus.webp'},
{name:'트리케라톱스',image:'images/dinosaurs/triceratops.png',thumbnail:'thumbnails/dinosaurs/triceratops.webp'},
{name:'브라키오사우루스',image:'images/dinosaurs/brachiosaurus.png',thumbnail:'thumbnails/dinosaurs/brachiosaurus.webp'},
{name:'스테고사우루스',image:'images/dinosaurs/stegosaurus.png',thumbnail:'thumbnails/dinosaurs/stegosaurus.webp'},
{name:'안킬로사우루스',image:'images/dinosaurs/ankylosaurus.png',thumbnail:'thumbnails/dinosaurs/ankylosaurus.webp'},
{id:'dinosaurs-weekly-20261023-parasaurolophus',name:'파라사우롤로푸스',image:'images/dinosaurs/parasaurolophus-20261023.png',thumbnail:'thumbnails/dinosaurs/parasaurolophus-20261023.webp'}
];
const nature=[
{name:'해바라기',image:'images/nature/sunflower.png',thumbnail:'thumbnails/nature/sunflower.webp'},
{name:'튤립',image:'images/nature/tulip.png',thumbnail:'thumbnails/nature/tulip.webp'},
{name:'참나무',image:'images/nature/oak-tree.png',thumbnail:'thumbnails/nature/oak-tree.webp'},
{name:'소나무',image:'images/nature/pine-tree.png',thumbnail:'thumbnails/nature/pine-tree.webp'},
{name:'버섯',image:'images/nature/mushroom.png',thumbnail:'thumbnails/nature/mushroom.webp'},
{id:'nature-weekly-20261024-maple-leaf',name:'단풍잎',image:'images/nature/maple-leaf-20261024.png',thumbnail:'thumbnails/nature/maple-leaf-20261024.webp'}
];
const home=[
{name:'의자',image:'images/home/chair.png',thumbnail:'thumbnails/home/chair.webp'},
{name:'소파',image:'images/home/sofa.png',thumbnail:'thumbnails/home/sofa.webp'},
{name:'침대',image:'images/home/bed.png',thumbnail:'thumbnails/home/bed.webp'},
{name:'옷장',image:'images/home/wardrobe.png',thumbnail:'thumbnails/home/wardrobe.webp'},
{name:'탁상등',image:'images/home/table-lamp.png',thumbnail:'thumbnails/home/table-lamp.webp'},
{id:'home-weekly-20261024-kettle',name:'주전자',image:'images/home/kettle-20261024.png',thumbnail:'thumbnails/home/kettle-20261024.webp'}
];
const play=[
{name:'축구공',image:'images/play/soccer-ball.png',thumbnail:'thumbnails/play/soccer-ball.webp'},
{name:'농구공',image:'images/play/basketball.png',thumbnail:'thumbnails/play/basketball.webp'},
{name:'야구 글러브',image:'images/play/baseball-glove.png',thumbnail:'thumbnails/play/baseball-glove.webp'},
{name:'테니스 라켓',image:'images/play/tennis-racket.png',thumbnail:'thumbnails/play/tennis-racket.webp'},
{name:'스케이트보드',image:'images/play/skateboard.png',thumbnail:'thumbnails/play/skateboard.webp'},
{id:'play-weekly-20261025-bowling-pin',name:'볼링핀',image:'images/play/bowling-pin-20261025.png',thumbnail:'thumbnails/play/bowling-pin-20261025.webp'}
];
const space=[
{name:'로켓',image:'images/space/rocket.png',thumbnail:'thumbnails/space/rocket.webp'},
{name:'우주비행사',image:'images/space/astronaut.png',thumbnail:'thumbnails/space/astronaut.webp'},
{name:'인공위성',image:'images/space/satellite.png',thumbnail:'thumbnails/space/satellite.webp'},
{name:'달 탐사차',image:'images/space/lunar-rover.png',thumbnail:'thumbnails/space/lunar-rover.webp'},
{name:'토성',image:'images/space/saturn.png',thumbnail:'thumbnails/space/saturn.webp'},
{id:'space-weekly-20261025-space-telescope',name:'우주 망원경',image:'images/space/space-telescope-20261025.png',thumbnail:'thumbnails/space/space-telescope-20261025.webp'}
];
const imagination=[
{id:'imagination-basic-circle',name:'상상 1',svg:'<circle cx="200" cy="200" r="95"/>'},
{id:'imagination-basic-ellipse',name:'상상 2',svg:'<ellipse cx="200" cy="200" rx="115" ry="75"/>'},
{id:'imagination-basic-triangle',name:'상상 3',svg:'<polygon points="200,100 305,285 95,285"/>'},
{id:'imagination-basic-square',name:'상상 4',svg:'<rect x="110" y="110" width="180" height="180"/>'},
{id:'imagination-basic-rectangle',name:'상상 5',svg:'<rect x="85" y="125" width="230" height="150"/>'},
{id:'imagination-basic-pentagon',name:'상상 6',svg:'<polygon points="200,95 300,168 262,285 138,285 100,168"/>'},
{id:'imagination-basic-hexagon',name:'상상 7',svg:'<polygon points="200,95 291,148 291,252 200,305 109,252 109,148"/>'},
{id:'imagination-basic-diamond',name:'상상 8',svg:'<polygon points="200,85 285,200 200,315 115,200"/>'},
{id:'imagination-basic-star',name:'상상 9',svg:'<polygon points="200,85 228,163 315,168 249,223 270,305 200,258 130,305 151,223 85,168 172,163"/>'},
{id:'imagination-basic-heart',name:'상상 10',svg:'<path fill="none" d="M200 145 C165 90 95 110 95 165 C95 210 155 260 200 295 C245 260 305 210 305 165 C305 110 235 90 200 145 Z"/>'},
{id:'imagination-half-circle',name:'상상 11',svg:'<path fill="none" d="M200 105 A95 95 0 0 0 200 295"/>'},
{id:'imagination-half-ellipse',name:'상상 12',svg:'<path fill="none" d="M200 125 A115 75 0 0 0 200 275"/>'},
{id:'imagination-half-triangle',name:'상상 13',svg:'<path fill="none" d="M200 100 L95 285 L200 285"/>'},
{id:'imagination-half-square',name:'상상 14',svg:'<path fill="none" d="M200 110 L110 110 L110 290 L200 290"/>'},
{id:'imagination-half-rectangle',name:'상상 15',svg:'<path fill="none" d="M200 125 L85 125 L85 275 L200 275"/>'},
{id:'imagination-half-pentagon',name:'상상 16',svg:'<path fill="none" d="M200 95 L100 168 L138 285 L200 285"/>'},
{id:'imagination-half-hexagon',name:'상상 17',svg:'<path fill="none" d="M200 95 L109 148 L109 252 L200 305"/>'},
{id:'imagination-half-diamond',name:'상상 18',svg:'<path fill="none" d="M200 85 L115 200 L200 315"/>'},
{id:'imagination-half-star',name:'상상 19',svg:'<path fill="none" d="M200 85 L172 163 L85 168 L151 223 L130 305 L200 258"/>'},
{id:'imagination-half-heart',name:'상상 20',svg:'<defs><clipPath id="imagination-half-heart-clip"><rect x="0" y="0" width="400" height="205.4"/></clipPath></defs><path fill="none" clip-path="url(#imagination-half-heart-clip)" d="M200 145 C165 90 95 110 95 165 C95 210 155 260 200 295 C245 260 305 210 305 165 C305 110 235 90 200 145 Z"/>'},
{id:'imagination-01',name:'상상 21',svg:'<path fill="none" d="M200 125 C170 76 105 90 108 145 C109 190 165 239 200 275"/>'},
{id:'imagination-02',name:'상상 22',svg:'<path fill="none" d="M125 225 A85 85 0 1 1 270 150"/>'},
{id:'imagination-03',name:'상상 23',svg:'<g fill="black" stroke="none"><circle cx="95" cy="115" r="5"/><circle cx="295" cy="95" r="5"/><circle cx="225" cy="300" r="5"/></g>'},
{id:'imagination-04',name:'상상 24',svg:'<path fill="none" d="M95 205 C125 145 155 265 185 205 S245 145 275 205"/>'},
{id:'imagination-05',name:'상상 25',svg:'<path fill="none" d="M65 130 Q105 70 145 130 M255 285 Q295 225 335 285"/>'},
{id:'imagination-06',name:'상상 26',svg:'<path fill="none" d="M120 245 L165 170 L200 220 L245 135"/>'},
{id:'imagination-07',name:'상상 27',svg:'<path fill="none" d="M145 180 L145 245 Q145 260 160 260 L235 260"/>'},
{id:'imagination-08',name:'상상 28',svg:'<path fill="none" d="M200 190 C180 165 155 195 176 213 C210 243 250 197 224 165 C197 132 150 147 132 175"/>'},
{id:'imagination-09',name:'상상 29',svg:'<path fill="none" d="M105 100 L105 195 M285 200 L285 295"/>'},
{id:'imagination-10',name:'상상 30',svg:'<path fill="none" d="M70 235 L125 135 M260 120 L320 220 M250 310 L140 310"/>'},
{id:'imagination-11',name:'상상 31',svg:'<path fill="none" d="M80 220 C55 145 100 90 165 85 M235 310 C290 300 330 260 330 205"/>'},
{id:'imagination-12',name:'상상 32',svg:'<path fill="none" d="M85 170 L85 90 L165 90 M235 310 L315 310 L315 230"/>'},
{id:'imagination-13',name:'상상 33',svg:'<path fill="none" d="M75 105 L170 105 M230 205 L325 205 M95 310 L190 310"/>'},
{id:'imagination-14',name:'상상 34',svg:'<path fill="none" d="M145 265 C90 215 140 165 200 105 C230 145 265 180 260 215"/>'},
{id:'imagination-15',name:'상상 35',svg:'<path fill="none" d="M115 155 C75 205 125 260 200 260 C275 260 315 205 280 155"/>'},
{id:'imagination-16',name:'상상 36',svg:'<g fill="black" stroke="none"><circle cx="80" cy="105" r="5"/><circle cx="290" cy="80" r="5"/><circle cx="120" cy="300" r="5"/><circle cx="315" cy="275" r="5"/></g>'},
{id:'imagination-17',name:'상상 37',svg:'<path fill="none" d="M100 275 L100 215 L165 215 L165 150 L230 150 L230 85"/>'},
{id:'imagination-18',name:'상상 38',svg:'<path fill="none" d="M70 180 C70 105 160 105 160 180"/><circle cx="295" cy="285" r="5" fill="black" stroke="none"/>'},
{id:'imagination-19',name:'상상 39',svg:'<path fill="none" d="M75 100 L125 150 L175 100 M245 300 L295 250 L345 300"/>'},
{id:'imagination-20',name:'상상 40',svg:'<path fill="none" d="M85 180 C85 110 155 100 165 145 C175 185 125 205 115 180 M265 265 L325 265"/>'},
{id:'imagination-weekly-20261019-41',name:'상상 41',svg:'<path fill="none" d="M85 265 C170 300 110 165 200 175 S285 100 315 125"/>'},
{id:'imagination-weekly-20261019-42',name:'상상 42',svg:'<path fill="none" d="M85 215 A130 130 0 0 1 215 85 M155 215 A60 60 0 0 1 215 155"/>'},
{id:'imagination-weekly-20261019-43',name:'상상 43',svg:'<path fill="none" d="M85 115 L145 175 M285 95 L255 175 M290 300 L215 265"/>'},
{id:'imagination-weekly-20261019-44',name:'상상 44',svg:'<path fill="none" d="M90 235 Q175 255 205 190 Q225 130 305 120 M205 190 L220 285"/>'},
{id:'imagination-weekly-20261019-45',name:'상상 45',svg:'<path fill="none" d="M100 100 L150 160 L100 200 M230 300 Q315 300 315 215"/>'}
];
globalThis.COLORING_CATEGORIES=[{name:'상상',items:imagination},{name:'동물',items},{name:'음식',items:food},{name:'과일·채소',items:produce},{name:'탈것',items:vehicles},{name:'바다',items:ocean},{name:'공룡',items:dinosaurs},{name:'자연',items:nature},{name:'우리 집',items:home},{name:'놀이·운동',items:play},{name:'우주',items:space},{name:'제안',items:[
{id:'suggestion-96e0f117-1357-4e77-8957-65447cd23205',name:'시소',image:'images/proposals/seesaw-96e0f117.png',thumbnail:'thumbnails/proposals/seesaw-96e0f117.webp',tags:["시소","놀이터","놀이기구"]},
{id:'suggestion-b9b46922-2cd7-4510-b36a-f2e446767fb7',name:'그네',image:'images/proposals/swing-b9b46922.png',thumbnail:'thumbnails/proposals/swing-b9b46922.webp',tags:["그네","놀이터","놀이기구"]}
]}];
})();
